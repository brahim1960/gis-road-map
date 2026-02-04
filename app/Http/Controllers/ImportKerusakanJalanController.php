<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Exception;
use Carbon\Carbon;

class ImportKerusakanJalanController extends Controller
{
    public function importCSVRoadDamage()
    {
        try {
            $csvPath = public_path('data/data_kerusakan2.csv');

            if (!File::exists($csvPath)) {
                return response()->json(['error' => 'File CSV tidak ditemukan'], 404);
            }

            $csvContent = File::get($csvPath);
            $lines = explode(PHP_EOL, $csvContent);
            $header = array_shift($lines);
            $rows = [];

            foreach ($lines as $line) {
                if (empty(trim($line))) continue;
                $row = str_getcsv($line, ',', '"');
                if (count($row) > 1) $rows[] = $row;
            }

            $insertedData = [];
            $skippedData = [];

            foreach ($rows as $index => $row) {
                $rowNumber = $index + 2;

                try {
                    if (empty($row[6]) || empty($row[7])) {
                        $skippedData[] = ['row' => $rowNumber, 'reason' => 'Latitude atau Longitude kosong'];
                        continue;
                    }

                    $lat = floatval($row[6]);
                    $long = floatval($row[7]);

                    if (empty($row[12])) {
                        $skippedData[] = ['row' => $rowNumber, 'reason' => 'Jenis kerusakan kosong'];
                        continue;
                    }

                    $tingkat_kerusakan = strtolower(trim($row[13] ?? ''));
                    if (!in_array($tingkat_kerusakan, ['ringan', 'sedang', 'berat'])) {
                        $skippedData[] = ['row' => $rowNumber, 'reason' => "Tingkat kerusakan '$tingkat_kerusakan' tidak valid"];
                        continue;
                    }

                    $jenis_kerusakan_full = trim(strtolower($row[12]));
                    $jenis_kerusakan_clean = trim(strtolower(preg_replace('/\s*\(.*\)/', '', $jenis_kerusakan_full)));

                    $jenis_kerusakan_record = DB::table('jenis_kerusakan')
                        ->whereRaw('LOWER(nama_kerusakan) = ?', [$jenis_kerusakan_full])
                        ->orWhereRaw('LOWER(nama_kerusakan) = ?', [$jenis_kerusakan_clean])
                        ->first();

                    if (!$jenis_kerusakan_record) {
                        $skippedData[] = ['row' => $rowNumber, 'reason' => "Jenis kerusakan '$jenis_kerusakan_full' tidak ditemukan"];
                        continue;
                    }

                    $tanggal = !empty($row[14]) ? Carbon::parse($row[14])->format('Y-m-d') : Carbon::now()->format('Y-m-d');

                    // Duplikat? pakai ST_DWithin untuk toleransi 1 meter
                    $existing = DB::table('kerusakan_jalan')
                        ->whereRaw("ST_DWithin(point::geography, ST_SetSRID(ST_Point(?, ?), 4326)::geography, 1)", [$long, $lat])
                        ->where('jenis_kerusakan_id', $jenis_kerusakan_record->id)
                        ->whereDate('tanggal', '=', $tanggal)
                        ->exists();

                    if ($existing) {
                        $skippedData[] = ['row' => $rowNumber, 'reason' => 'Data duplikat berdasarkan lokasi, jenis kerusakan, dan tanggal'];
                        continue;
                    }

                    // Cari kecamatan dengan toleransi 100 meter
                    $kecamatan = DB::select("
                        SELECT id FROM kecamatan
                        WHERE ST_DWithin(area::geography, ST_SetSRID(ST_Point(?, ?), 4326)::geography, 100)
                    ", [$long, $lat]);

                    if (empty($kecamatan)) {
                        // Retry with larger radius
                        $kecamatan = DB::select("
                            SELECT id FROM kecamatan
                            WHERE ST_DWithin(area::geography, ST_SetSRID(ST_Point(?, ?), 4326)::geography, 300)
                        ", [$long, $lat]);
                    }


                    $data = [
                        'kecamatan_id' => $kecamatan[0]->id,
                        'jenis_kerusakan_id' => $jenis_kerusakan_record->id,
                        'alamat' => $row[1] ?? 'Tanpa alamat',
                        'point' => DB::raw("ST_SetSRID(ST_Point($long, $lat), 4326)"),
                        'km_awal' => intval($row[2] ?? 0),
                        'm_awal' => intval($row[3] ?? 0),
                        'km_akhir' => intval($row[4] ?? 0),
                        'm_akhir' => intval($row[5] ?? 0),
                        'panjang' => floatval($row[9] ?? 0),
                        'lebar' => floatval($row[10] ?? 0),
                        'tinggi' => floatval($row[11] ?? 0),
                        'tingkat_kerusakan' => $tingkat_kerusakan,
                        'tanggal' => $tanggal,
                        'deskripsi' => $row[8] ?? '',
                        'gambar' => null,
                        'created_at' => now(),
                        'updated_at' => now()
                    ];

                    $id = DB::table('kerusakan_jalan')->insertGetId($data);

                    $insertedData[] = [
                        'id' => $id,
                        'row' => $rowNumber,
                        'alamat' => $data['alamat'],
                        'koordinat' => "$lat, $long",
                        'jenis_kerusakan' => $jenis_kerusakan_record->nama_kerusakan,
                        'tingkat_kerusakan' => $tingkat_kerusakan
                    ];

                } catch (Exception $e) {
                    $skippedData[] = ['row' => $rowNumber, 'reason' => $e->getMessage()];
                }
            }

            if (count($insertedData) === 0) {
                return response()->json([
                    'error' => 'Tidak ada data yang berhasil diimpor',
                    'skipped_data' => $skippedData,
                    'total_rows' => count($rows),
                    'total_skipped' => count($skippedData)
                ], 400);
            }

            return response()->json([
                'message' => 'Proses import selesai',
                'total_rows' => count($rows),
                'imported_count' => count($insertedData),
                'skipped_count' => count($skippedData),
                'imported_data' => $insertedData,
                'skipped_data' => $skippedData
            ]);

        } catch (Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }
}

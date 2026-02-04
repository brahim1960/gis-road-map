<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class InputDataController extends Controller
{
    public function importGeoJSON()
    {
        try {
            // Path ke file JSON
            $jsonPath = public_path('data/kecamatan_inhu.geojson');

            // Cek apakah file exists
            if (!File::exists($jsonPath)) {
                return response()->json(['error' => 'File JSON tidak ditemukan'], 404);
            }

            // Baca konten file
            $jsonContent = File::get($jsonPath);

            // Decode JSON
            $geoData = json_decode($jsonContent, true);

            // Validasi apakah JSON valid
            if (json_last_error() !== JSON_ERROR_NONE) {
                return response()->json(['error' => 'Format JSON tidak valid'], 400);
            }

            // Validasi struktur data
            if (!isset($geoData['features'])) {
                return response()->json(['error' => 'Format GeoJSON tidak sesuai'], 400);
            }

            foreach ($geoData['features'] as $feature) {
                $namaKecamatan = Str::lower($feature['properties']['NAMOBJ']);

                // Konversi geometry ke GeoJSON string
                $geometry = json_encode($feature['geometry']);

                // Insert menggunakan ST_GeomFromGeoJSON
                DB::insert("
                    INSERT INTO kecamatan (nama_kecamatan, area, status, created_at, updated_at)
                    VALUES (?, ST_GeomFromGeoJSON(?), true, now(), now())",
                    [$namaKecamatan, $geometry]
                );
            }

            // Verifikasi data yang telah diimport
            $importedData = DB::select("
                SELECT
                    id,
                    nama_kecamatan,
                    ST_AsGeoJSON(area) as area_geojson,
                    status
                FROM kecamatan
            ");

            return response()->json([
                'message' => 'Data kecamatan berhasil diimpor',
                'data' => array_map(function($row) {
                    $row->area_geojson = json_decode($row->area_geojson);
                    return $row;
                }, $importedData)
            ]);

        } catch (Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    public function viewKecamatan()
    {
        try {
            $kecamatan = DB::select("
                SELECT
                    id,
                    nama_kecamatan,
                    ST_AsGeoJSON(area) as area,
                    status
                FROM kecamatan
            ");

            return response()->json([
                'data' => array_map(function($row) {
                    $row->area = json_decode($row->area);
                    return $row;
                }, $kecamatan)
            ]);

        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function debugGeoJSON()
    {
        try {
            $jsonPath = public_path('data/kecamatan_inhu.geojson');
            $jsonContent = File::get($jsonPath);
            $geoData = json_decode($jsonContent, true);

            // Ambil satu feature untuk debugging
            $sampleFeature = $geoData['features'][0];

            return response()->json([
                'properties' => $sampleFeature['properties'],
                'geometry_type' => $sampleFeature['geometry']['type'],
                'coordinates_sample' => array_slice($sampleFeature['geometry']['coordinates'][0], 0, 5)
            ]);

        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updateKecamatan()
    {
        try {
            // Path file GeoJSON
            $filePath = public_path('data/kecamatan_inhu_2.geojson');

            // Baca file GeoJSON
            if (!file_exists($filePath)) {
                return response()->json([
                    'success' => false,
                    'message' => "File tidak ditemukan: {$filePath}"
                ], 404);
            }

            $geoJsonContent = file_get_contents($filePath);
            $geoData = json_decode($geoJsonContent, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                return response()->json([
                    'success' => false,
                    'message' => "Error parsing JSON: " . json_last_error_msg()
                ], 400);
            }

            // Mulai transaksi database
            DB::beginTransaction();

            // Ambil semua data kecamatan dari database
            $kecamatanFromDb = DB::table('kecamatan')->get(['id', 'nama_kecamatan']);

            if ($kecamatanFromDb->isEmpty()) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => "Tidak ada data kecamatan di database"
                ], 404);
            }

            // Proses data GeoJSON
            $features = [];
            if (isset($geoData['type'])) {
                if ($geoData['type'] === 'Feature') {
                    $features = [$geoData];
                } elseif ($geoData['type'] === 'FeatureCollection') {
                    $features = $geoData['features'];
                } else {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => "Format GeoJSON tidak didukung"
                    ], 400);
                }
            } else {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => "Format GeoJSON tidak valid"
                ], 400);
            }

            // Siapkan array untuk matching
            $matchedData = [];
            $unmatchedFromFile = [];
            $unmatchedFromDb = [];

            // Buat array nama kecamatan dari database (lowercase untuk perbandingan)
            $dbKecamatanMap = [];
            foreach ($kecamatanFromDb as $kec) {
                $dbKecamatanMap[strtolower(trim($kec->nama_kecamatan))] = $kec;
            }

            // Bandingkan setiap feature dengan data database
            foreach ($features as $feature) {
                if (!isset($feature['properties'])) {
                    continue;
                }

                $properties = $feature['properties'];

                // Coba berbagai field nama yang mungkin ada
                $namaFromFile = null;
                $possibleNameFields = ['name', 'nama', 'name:id', 'nama_kecamatan', 'official_name', 'official_name:en'];

                foreach ($possibleNameFields as $field) {
                    if (isset($properties[$field]) && !empty($properties[$field])) {
                        $namaFromFile = $properties[$field];
                        break;
                    }
                }

                if (!$namaFromFile) {
                    Log::warning("Nama kecamatan tidak ditemukan dalam properties", $properties);
                    continue;
                }

                $namaFromFileLower = strtolower(trim($namaFromFile));

                // Cek apakah nama cocok dengan database
                if (isset($dbKecamatanMap[$namaFromFileLower])) {
                    $matchedData[] = [
                        'db_record' => $dbKecamatanMap[$namaFromFileLower],
                        'geometry' => $feature['geometry'],
                        'file_name' => $namaFromFile
                    ];

                    // Hapus dari map untuk tracking yang tidak cocok
                    unset($dbKecamatanMap[$namaFromFileLower]);
                } else {
                    $unmatchedFromFile[] = $namaFromFile;
                }
            }

            // Sisa di dbKecamatanMap adalah yang tidak cocok dari database
            foreach ($dbKecamatanMap as $kec) {
                $unmatchedFromDb[] = $kec->nama_kecamatan;
            }

            // Validasi: pastikan semua data bisa dicocokkan
            if (!empty($unmatchedFromFile) || !empty($unmatchedFromDb)) {
                DB::rollBack();

                $errorMessage = "Tidak semua data bisa dicocokkan:";
                $details = [];

                if (!empty($unmatchedFromFile)) {
                    $details['tidak_ditemukan_di_database'] = $unmatchedFromFile;
                }

                if (!empty($unmatchedFromDb)) {
                    $details['tidak_ditemukan_di_file'] = $unmatchedFromDb;
                }

                return response()->json([
                    'success' => false,
                    'message' => $errorMessage,
                    'details' => $details
                ], 400);
            }

            // Jika semua cocok, lakukan update
            $updatedCount = 0;
            $updatedDetails = [];

            foreach ($matchedData as $data) {
                $geometryWkt = $this->geometryToWkt($data['geometry']);

                $updated = DB::table('kecamatan')
                    ->where('id', $data['db_record']->id)
                    ->update([
                        'area' => DB::raw("ST_GeomFromText('{$geometryWkt}', 4326)"),
                        'updated_at' => now()
                    ]);

                if ($updated) {
                    $updatedCount++;
                    $updatedDetails[] = [
                        'id' => $data['db_record']->id,
                        'nama' => $data['db_record']->nama_kecamatan,
                        'file_name' => $data['file_name']
                    ];
                    Log::info("Updated geometry for: " . $data['db_record']->nama_kecamatan);
                }
            }

            // Commit transaksi
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Berhasil memperbarui geometry untuk {$updatedCount} kecamatan",
                'updated_count' => $updatedCount,
                'updated_details' => $updatedDetails
            ]);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error("Error updating kecamatan geometry: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Terjadi error: ' . $e->getMessage()
            ], 500);
        }
    }

    private function geometryToWkt($geometry)
    {
        if (!isset($geometry['type']) || !isset($geometry['coordinates'])) {
            throw new Exception("Format geometry tidak valid");
        }

        switch ($geometry['type']) {
            case 'Point':
                return "POINT(" . implode(' ', $geometry['coordinates']) . ")";

            case 'LineString':
                $points = array_map(function($coord) {
                    return implode(' ', $coord);
                }, $geometry['coordinates']);
                return "LINESTRING(" . implode(', ', $points) . ")";

            case 'Polygon':
                $rings = array_map(function($ring) {
                    $points = array_map(function($coord) {
                        return implode(' ', $coord);
                    }, $ring);
                    return "(" . implode(', ', $points) . ")";
                }, $geometry['coordinates']);
                return "POLYGON(" . implode(', ', $rings) . ")";

            case 'MultiPolygon':
                $polygons = array_map(function($polygon) {
                    $rings = array_map(function($ring) {
                        $points = array_map(function($coord) {
                            return implode(' ', $coord);
                        }, $ring);
                        return "(" . implode(', ', $points) . ")";
                    }, $polygon);
                    return "(" . implode(', ', $rings) . ")";
                }, $geometry['coordinates']);
                return "MULTIPOLYGON(" . implode(', ', $polygons) . ")";

            default:
                throw new Exception("Tipe geometry tidak didukung: " . $geometry['type']);
        }
    }
}

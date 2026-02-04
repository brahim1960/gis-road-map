<?php

namespace App\Http\Controllers;

use App\Http\Requests\KerusakanJalanRequest;
use App\Models\kecamatan;
use App\Models\Kerusakan_Jalan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class KerusakanJalanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $kerusakan_jalan = Kerusakan_Jalan::with(['kecamatan' => function($query)
        {
            $query->select('id', 'nama_kecamatan');
        },
            'jenis_kerusakan' => function($query) {
            $query->select('id', 'nama_kerusakan');
        }])
            ->select(
                'id',
                'alamat',
                'km_awal',
                'm_awal',
                'km_akhir',
                'm_akhir',
                'panjang',
                'lebar',
                'tinggi',
                'tingkat_kerusakan',
                'jenis_kerusakan_id',
                'kecamatan_id',
                'gambar'
            )
            ->orderBy('alamat')
            ->orderBy('km_awal')
            ->orderBy('m_awal')
            ->get();

        return view('admin.kerusakan-jalan.index', [
            'title' => 'Kerusakan Jalan | Dashboard',
            'kerusakans' => $kerusakan_jalan
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $kecamatan = Kecamatan::where('status', true)
            ->select('id', 'nama_kecamatan', DB::raw('ST_AsGeoJSON(area) as area'))
            ->get()
            ->map(function($item) {
                $item->area = json_decode($item->area, true);
                return $item;
            });

        $jenisKerusakan = DB::table('jenis_kerusakan')->get();

        return view('admin.kerusakan-jalan.create', [
            'title' => 'Tambah Kerusakan Jalan | Dashboard',
            'jenisKerusakan' => $jenisKerusakan,
            'kecamatans' => $kecamatan,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(KerusakanJalanRequest $request)
    {
        $data = $request->validated();

        try {
            if ($request->hasFile('gambar')) {
                $file = $request->file('gambar');

                $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                $extension = $file->getClientOriginalExtension();

                $timestamp = now()->format('Ymd_His');
                $uniqueName = Str::slug($originalName) . '-' . $timestamp . '.' . $extension;

                $path = $file->storeAs('images/kerusakan-jalan', $uniqueName, 'public');

                $data['gambar'] = $path;
            }

            if (empty($data['point'])) {
                return back()->with('error', 'Koordinat tidak boleh kosong');
            }

            $data['point'] = DB::raw("ST_SetSRID(ST_GeomFromText('{$data['point']}'), 4326)");

            Kerusakan_Jalan::create($data);

            return back()->with('success', 'Data kerusakan jalan berhasil ditambahkan');

        } catch (\Exception $e) {
            if (isset($path)) {
                Storage::disk('public')->delete($path);
            }

            return back()->withInput()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $kerusakan_jalan = Kerusakan_Jalan::with(['kecamatan', 'jenis_kerusakan'])
            ->select(
                'id',
                'alamat',
                DB::raw("ST_Y(point) as latitude"),
                DB::raw("ST_X(point) as longitude"),
                'km_awal',
                'm_awal',
                'km_akhir',
                'm_akhir',
                'panjang',
                'lebar',
                'tinggi',
                'tingkat_kerusakan',
                'tanggal',
                'deskripsi',
                'gambar',
                'jenis_kerusakan_id',
                'kecamatan_id',
                'created_at',
                'updated_at'
            )
            ->findOrFail($id);

        return view('admin.kerusakan-jalan.detail', [
            'title' => 'Kerusakan ' . $kerusakan_jalan->alamat . ' | Dashboard',
            'kerusakan' => $kerusakan_jalan
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $kerusakan_jalan = Kerusakan_Jalan::with(['kecamatan', 'jenis_kerusakan'])
            ->select(
                'id',
                'alamat',
                DB::raw("ST_Y(point) as latitude"),
                DB::raw("ST_X(point) as longitude"),
                'km_awal',
                'm_awal',
                'km_akhir',
                'm_akhir',
                'panjang',
                'lebar',
                'tinggi',
                'tingkat_kerusakan',
                'tanggal',
                'deskripsi',
                'gambar',
                'jenis_kerusakan_id',
                'kecamatan_id',
                'created_at',
                'updated_at'
            )
            ->findOrFail($id);

        return view('admin.kerusakan-jalan.update', [
            'title' => 'Edit ' . $kerusakan_jalan->alamat . ' | Dashboard',
            'kerusakan' => $kerusakan_jalan,
            'jenisKerusakan' => DB::table('jenis_kerusakan')->get(),
            'kecamatans' => Kecamatan::where('status', true)
                ->select('id', 'nama_kecamatan', DB::raw('ST_AsGeoJSON(area) as area'))
                ->get()
                ->map(function($item) {
                    $item->area = json_decode($item->area, true);
                    return $item;
                })
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(KerusakanJalanRequest $request, string $id)
    {
        $kerusakan = Kerusakan_Jalan::findOrFail($id);
        $data = $request->validated();

        try {
            if ($request->hasFile('gambar')) {
                $file = $request->file('gambar');

                $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                $extension = $file->getClientOriginalExtension();

                $timestamp = now()->format('Ymd_His');
                $uniqueName = Str::slug($originalName) . '-' . $timestamp . '.' . $extension;

                $path = $file->storeAs('images/kerusakan-jalan', $uniqueName, 'public');

                if ($kerusakan->gambar && Storage::disk('public')->exists($kerusakan->gambar)) {
                    Storage::disk('public')->delete($kerusakan->gambar);
                }

                $data['gambar'] = $path;
            }

            if (empty($data['point'])) {
                return back()->withInput()->with('error', 'Koordinat tidak boleh kosong');
            }

            $data['point'] = DB::raw("ST_SetSRID(ST_GeomFromText('{$data['point']}'), 4326)");

            $kerusakan->update($data);

            return redirect()->route('kerusakan-jalan.index')
                ->with('success', 'Data kerusakan jalan berhasil diperbarui');
        } catch (\Exception $e) {
            if (isset($path)) {
                Storage::disk('public')->delete($path);
            }

            return back()->withInput()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $kerusakanJalan = Kerusakan_Jalan::findOrFail($id);

        if ($kerusakanJalan->gambar && Storage::disk('public')->exists('kerusakan/' . $kerusakanJalan->gambar)) {
            Storage::disk('public')->delete('kerusakan/' . $kerusakanJalan->gambar);
        }

        $kerusakanJalan->delete();

        return redirect()->route('kerusakan-jalan.index')
            ->with('success', 'Data kerusakan jalan berhasil dihapus.');
    }

    public function exportCsv()
    {
        // Ambil data dengan relasi dan koordinat
        $data = Kerusakan_Jalan::select([
            'kerusakan_jalan.*',
            'jenis_kerusakan.nama_kerusakan',
            DB::raw('ST_Y(kerusakan_jalan.point) as latitude'),
            DB::raw('ST_X(kerusakan_jalan.point) as longitude')
        ])
            ->leftJoin('jenis_kerusakan', 'kerusakan_jalan.jenis_kerusakan_id', '=', 'jenis_kerusakan.id')
            ->orderBy('alamat')
            ->orderBy('km_awal')
            ->orderBy('m_awal')
            ->get();

        // Set headers untuk download CSV
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="data_kerusakan_jalan_' . date('Y-m-d_H-i-s') . '.csv"',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0'
        ];

        // Buat callback untuk generate CSV
        $callback = function() use ($data) {
            $file = fopen('php://output', 'w');

            // Tambahkan BOM untuk UTF-8 agar Excel bisa baca karakter Indonesia dengan benar
            fwrite($file, "\xEF\xBB\xBF");

            // Header CSV
            fputcsv($file, [
                'No',
                'Ruas Jalan',
                'STA',
                'Lat',
                'Long',
                'Deskripsi',
                'Panjang (m)',
                'Lebar (m)',
                'Tinggi (m)',
                'Jenis Kerusakan',
                'Tingkat Kerusakan',
                'Tanggal'
            ]);

            // Data rows
            $no = 1;
            foreach ($data as $item) {
                // Format STA (km+m awal dan km+m akhir)
                $sta = sprintf("%d+%03d\n%d+%03d",
                    $item->km_awal,
                    $item->m_awal,
                    $item->km_akhir,
                    $item->m_akhir
                );

                fputcsv($file, [
                    $no++,
                    $item->alamat ?? '-',
                    $sta,
                    $item->latitude ? number_format($item->latitude, 8) : '-',
                    $item->longitude ? number_format($item->longitude, 8) : '-',
                    $item->deskripsi ?? '-',
                    $item->panjang ?? '-',
                    $item->lebar ?? '-',
                    $item->tinggi ?? '-',
                    $item->nama_kerusakan ?? '-',
                    ucfirst($item->tingkat_kerusakan) ?? '-',
                    $item->tanggal ? date('d-m-Y', strtotime($item->tanggal)) : '-'
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Kerusakan_Jalan;
use Illuminate\Support\Facades\DB;

class PetaController extends Controller
{
    public function index()
    {
        $kerusakan = Kerusakan_Jalan::with(['kecamatan:id,nama_kecamatan', 'jenis_kerusakan:id,nama_kerusakan'])
            ->select(
                'id',
                'alamat',
                DB::raw('ST_Y(point) as lat'),
                DB::raw('ST_X(point) as lon'),
                'km_awal',
                'm_awal',
                'km_akhir',
                'm_akhir',
                'panjang',
                'lebar',
                'tinggi',
                'tanggal',
                'tingkat_kerusakan',
                'gambar',
                'kecamatan_id',
                'jenis_kerusakan_id'
            )->get();

        $kerusakan->each(function ($k) {
            $k->gambar_url = $k->gambar_url;
        });

        $segments = DB::table('nkde_summary')->get();

        return view('guest.peta', [
            'title' => 'Peta Kerusakan Jalan',
            'kerusakanPoints' => $kerusakan,
            'jalanSegments' => $segments,
            'radius' => 100
        ]);
    }
}

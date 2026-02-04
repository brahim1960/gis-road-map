<?php

namespace App\Http\Controllers;

use App\Models\Jenis_Kerusakan;
use App\Models\kecamatan;
use App\Models\Kerusakan_Jalan;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $totalJenisKerusakan = Jenis_Kerusakan::count();
        $totalKecamatan = Kecamatan::where('status', true)->count();
        $totalRuasJalan = DB::table('jalan')->count();
        $totalKerusakan = Kerusakan_Jalan::count();

        $kerusakanBerat = Kerusakan_Jalan::where('tingkat_kerusakan', 'berat')->count();
        $kerusakanSedang = Kerusakan_Jalan::where('tingkat_kerusakan', 'sedang')->count();
        $kerusakanRingan = Kerusakan_Jalan::where('tingkat_kerusakan', 'ringan')->count();

        $statistikKecamatan = Kecamatan::select('kecamatan.id', 'kecamatan.nama_kecamatan')
            ->leftJoin('kerusakan_jalan', 'kecamatan.id', '=', 'kerusakan_jalan.kecamatan_id')
            ->where('kecamatan.status', true)
            ->groupBy('kecamatan.id', 'kecamatan.nama_kecamatan')
            ->orderBy('kecamatan.nama_kecamatan')
            ->get()
            ->map(function ($kecamatan) {
                $berat = Kerusakan_Jalan::where('kecamatan_id', $kecamatan->id)
                    ->where('tingkat_kerusakan', 'berat')
                    ->count();

                $sedang = Kerusakan_Jalan::where('kecamatan_id', $kecamatan->id)
                    ->where('tingkat_kerusakan', 'sedang')
                    ->count();

                $ringan = Kerusakan_Jalan::where('kecamatan_id', $kecamatan->id)
                    ->where('tingkat_kerusakan', 'ringan')
                    ->count();

                return [
                    'kecamatan' => $kecamatan->nama_kecamatan,
                    'berat' => $berat,
                    'sedang' => $sedang,
                    'ringan' => $ringan
                ];
            });

        return view('admin.dashboard.index', [
            'title' => 'Dashboard',
            'totalJenisKerusakan' => $totalJenisKerusakan,
            'totalKecamatan' => $totalKecamatan,
            'totalRuasJalan' => $totalRuasJalan,
            'totalKerusakan' => $totalKerusakan,
            'kerusakanBerat' => $kerusakanBerat,
            'kerusakanSedang' => $kerusakanSedang,
            'kerusakanRingan' => $kerusakanRingan,
            'statistikKecamatan' => $statistikKecamatan
        ]);
    }
}

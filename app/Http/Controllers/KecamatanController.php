<?php

namespace App\Http\Controllers;

use App\Http\Requests\KecamatanRequest;
use App\Models\kecamatan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class KecamatanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $kecamatan = Kecamatan::select('*', DB::raw("ST_AsGeoJSON(area) as area"))
            ->orderBy('created_at')
            ->get()
            ->map(function($item) {
                $item->area = json_decode($item->area, true);
                return $item;
            });

        return view('admin.kecamatan.index', [
            'title' => 'Kecamatan | Dashboard',
            'kecamatans' => $kecamatan
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(KecamatanRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $kecamatan = Kecamatan::select('id', 'nama_kecamatan', 'status', DB::raw("ST_AsGeoJSON(area) as area"))
            ->where('id', $id)
            ->firstOrFail();

        $kecamatan->area = json_decode($kecamatan->area);

        return view('admin.kecamatan.detail', [
            'title' => 'Kecamatan ' . ucwords($kecamatan->nama_kecamatan) . ' | Dashboard',
            'kecamatan' => $kecamatan
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(KecamatanRequest $request, string $id)
    {
        $validated = $request->validated();
        $kecamatan = Kecamatan::find($id);

        $kecamatan->nama_kecamatan = $validated['nama_kecamatan'];
        $kecamatan->status = isset($validated['status']) ? 1 : 0;
        $kecamatan->save();

        return back()->with('success', 'Update kecamatan berhasil');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

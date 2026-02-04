<?php

namespace App\Http\Controllers;

use App\Models\Jenis_Kerusakan;
use App\Http\Requests\JenisKerusakanRequest;
use Illuminate\Http\Request;

class JenisKerusakanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('admin.jenis-kerusakan.index', [
            'title' => 'Jenis Kerusakan | Dashboard',
            'jenisKerusakans' => Jenis_Kerusakan::orderBy('created_at')->get()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.jenis-kerusakan.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(JenisKerusakanRequest $request)
    {
        $validated = $request->validated();
        $validated['nama_kerusakan'] = strtolower($validated['nama_kerusakan']);

        Jenis_Kerusakan::create($validated);
        return back()->with('success', 'Tambah jenis kerusakan berhasil');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $jenisKerusakan = Jenis_Kerusakan::findOrFail($id);

        return view('admin.jenis-kerusakan.edit', [
            'title' => 'Edit ' . $jenisKerusakan->nama_kerusakan . ' | Dashboard',
            'jenisKerusakan' => $jenisKerusakan
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(JenisKerusakanRequest $request, string $id)
    {
        $validated = $request->validated();
        $validated['nama_kerusakan'] = strtolower($validated['nama_kerusakan']);

        $jenisKerusakan = Jenis_Kerusakan::find($id);
        $jenisKerusakan->update($validated);

        return back()->with('success', 'Update jenis kerusakan berhasil');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $jenisKerusakan = Jenis_Kerusakan::findOrFail($id);

        if($jenisKerusakan->kerusakan_jalan()->exists()) {
            return back()->with('error', 'Tidak bisa menghapus jenis kerusakan ' . ucwords($jenisKerusakan->nama_kerusakan) . ' karena masih digunakan');
        }

        $jenisKerusakan->delete();
        return back()->with('success', 'Hapus jenis kerusakan berhasil');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Kerusakan_Jalan extends Model
{
    use HasFactory;

    protected $table = 'kerusakan_jalan';
    protected $guarded = ['id'];

    protected $casts = [
        'tanggal' => 'datetime',
    ];

    public function jenis_kerusakan()
    {
        return $this->belongsTo(Jenis_Kerusakan::class);
    }

    public function kecamatan()
    {
        return $this->belongsTo(Kecamatan::class);
    }

    public function getGambarUrlAttribute()
    {
        if (!$this->gambar) return null;

        if (Storage::disk('public')->exists($this->gambar)) {
            return asset('storage/' . $this->gambar);
        }

        return null;
    }

}

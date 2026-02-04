<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jenis_Kerusakan extends Model
{
    use HasFactory;

    protected $table = 'jenis_kerusakan';
    protected $guarded = ['id'];

    public function kerusakan_jalan()
    {
        return $this->hasMany(Kerusakan_Jalan::class, 'jenis_kerusakan_id');
    }
}

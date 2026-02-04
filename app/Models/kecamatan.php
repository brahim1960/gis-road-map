<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class kecamatan extends Model
{
    use HasFactory;

    protected $table = 'kecamatan';
    protected $guarded =['id'];

    public function kerusakan_jalan()
    {
        return $this->hasMany(Kerusakan_Jalan::class, 'kecamatan_id');
    }
}

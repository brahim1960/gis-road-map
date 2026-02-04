<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JenisKerusakanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('jenis_kerusakan')->insert([
            [
                'nama_kerusakan' => 'alur (rutting)',
                'deskripsi' => 'penurunan memanjang yang terjadi pada jalur jejak roda kiri (JRKI) dan jejak roda kanan (RJKA), terutama akibat dari deformasi permanen pada lapis perkerasan atau tanah dasar, yang biasanya disebabkan konsolidasi atau pergerakan lateral bahan perkerasan akibat beban kendaraan',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nama_kerusakan' => 'lubang (potholes)',
                'deskripsi' => 'berupa mangkuk, ukuran bervariasi dari kecil sampai besar. Lubang–lubang ini menampung dan meresapkan air ke dalam lapis permukaan yang menyebabkan semakin parahnya kerusakan jalan',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nama_kerusakan' => 'pelepasan butir (raveling)',
                'deskripsi' => 'lepasnya butir agregat pada permukaan jalan beraspal, dapat diakibatkan oleh kandungan aspal yang rendah, campuran yang kurang baik, pemadatan yang kurang, segregasi, atau pengelupasan aspal',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nama_kerusakan' => 'retak blok (block cracking)',
                'deskripsi' => 'retak blok merupakan retak saling berhubungan dan membagi permukaan menjadi kotak-kotak yang berbentuk hampir bujur sangkar, utamanya disebabkan oleh penyusutan lapis beraspal atau karakteristik aspal dan temperatur, bukan akibat beban lalu lintas.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nama_kerusakan' => 'retak buaya',
                'deskripsi' => 'retak yang membentuk serangkaian kotak-kotak kecil yang saling berhubungan pada permukaan perkerasan beraspal menyerupai kulit buaya, umumnya akibat keruntuhan lelah oleh beban kendaraan yang berulang.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nama_kerusakan' => 'retak melintang (transverse cracking)',
                'deskripsi' => 'retak yang terjadi pada arah lebar perkerasan dan hampir tegak lurus sumbu jalan atau arah penghamparan. retak melintang biasanya tidak terkait dengan beban lalu lintas',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nama_kerusakan' => 'retak memanjang',
                'deskripsi' => 'Retak paralel yang sejajar dengan sumbu jalan atau arah penghamparan yang dapat disebabkan oleh pembentukan sambungan memanjang yang kurang baik, akibat penyusutan lapis beton aspal yang diakibatkan oleh temperatur yang rendah atau penuaan aspal, atau siklus temperatur harian, atau gabungan dari faktor-faktor tersebut',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nama_kerusakan' => 'retak tepi (edge cracking)',
                'deskripsi' => 'retak memanjang yang sejajar dengan tepi perkerasan dan biasanya terjadi sekitar 0,3 m sampai 0,5 m dari tepi luar perkerasan. Retak tepi diperparah oleh beban kendaraan dan dapat ditimbulkan oleh pelemahan lapis fondasi atas atau tanah dasar',
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);
    }
}

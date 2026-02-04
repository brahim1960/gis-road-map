<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\File;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('jalan', function (Blueprint $table) {
            $table->id();
            $table->string('nama_jalan')->nullable();
            $table->string('type')->nullable();
            $table->geometry('line');
            $table->timestamps();

            $table->spatialIndex('line');
        });

        $this->importGeojsonData();
    }

    private function importGeojsonData(): void
    {
        $path = public_path('data/jalan_inhu.geojson');

        if (!File::exists($path)) {
            echo "File jalan_inhu.geojson tidak ditemukan.\n";
            return;
        }

        $geojson = json_decode(File::get($path), true);

        if (!isset($geojson['features'])) {
            echo "Format GeoJSON tidak valid.\n";
            return;
        }

        foreach ($geojson['features'] as $feature) {
            $name = $feature['properties']['name'] ?? null;
            $type = $feature['properties']['highway'] ?? null;

            $namaJalan = $name ?: null;

            $coordinates = $feature['geometry']['coordinates'] ?? null;
            $geomType = $feature['geometry']['type'] ?? null;

            if ($geomType !== 'LineString' || !is_array($coordinates)) {
                continue;
            }

            $wkt = 'LINESTRING(' . implode(', ', array_map(function ($point) {
                    return "{$point[0]} {$point[1]}";
                }, $coordinates)) . ')';

            DB::table('jalan')->insert([
                'nama_jalan' => $namaJalan,
                'type'       => $type,
                'line'       => DB::raw("ST_GeomFromText('$wkt', 4326)"),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jalan');
    }
};

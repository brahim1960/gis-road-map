<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('kerusakan_jalan', function (Blueprint $table) {
            $table->id();
            $table->string('alamat')->nullable();
            $table->geometry('point')->nullable();
            $table->integer('km_awal')->nullable();
            $table->integer('m_awal')->nullable();
            $table->integer('km_akhir')->nullable();
            $table->integer('m_akhir')->nullable();
            $table->float('panjang')->nullable();
            $table->float('lebar')->nullable();
            $table->float('tinggi')->nullable();
            $table->string('tingkat_kerusakan');
            $table->timestamp('tanggal')->nullable();
            $table->text('deskripsi')->nullable();
            $table->string('gambar')->nullable();
            $table->foreignId('jenis_kerusakan_id')
                ->references('id')
                ->on('jenis_kerusakan')
                ->restrictOnDelete()
                ->cascadeOnUpdate();
            $table->foreignId('kecamatan_id')
                ->references('id')
                ->on('kecamatan')
                ->restrictOnDelete()
                ->cascadeOnUpdate();
            $table->timestamps();
        });

        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::statement('CREATE INDEX kerusakan_jalan_point_index ON kerusakan_jalan USING GIST (point)');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kerusakan_jalan');
    }
};

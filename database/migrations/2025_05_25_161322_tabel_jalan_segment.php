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
        Schema::create('jalan_segment', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('jalan_id')->nullable();
            $table->integer('segment_number')->nullable();
            $table->geometry('line');
            $table->geometry('start_point')->nullable();
            $table->geometry('end_point')->nullable();
            $table->double('length')->nullable();
            $table->double('cumulative_distance')->default(0);
            $table->timestamps();

            $table->foreign('jalan_id')->references('id')->on('jalan')->onDelete('cascade');
            $table->spatialIndex('line');
            $table->index(['jalan_id', 'segment_number']);
        });

        $this->dataJalan();
    }

// Tanpa jalan_nama di segment
    private function dataJalan(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            DB::statement("
            INSERT INTO jalan_segment (jalan_id, segment_number, line, start_point, end_point, length, cumulative_distance, created_at, updated_at)
            SELECT
                jalan_id,
                segment_number,
                segment_line,
                ST_StartPoint(segment_line),
                ST_EndPoint(segment_line),
                ST_Length(ST_Transform(segment_line, 3857)),
                cumulative_start,
                NOW(), NOW()
            FROM (
                SELECT
                    j.id as jalan_id,
                    (n + 1) as segment_number,
                    (n * 50.0) as cumulative_start,
                    ST_LineSubstring(
                        j.line,
                        (n * 50.0) / ST_Length(ST_Transform(j.line, 3857)),
                        LEAST(((n + 1) * 50.0) / ST_Length(ST_Transform(j.line, 3857)), 1.0)
                    ) as segment_line
                FROM jalan j
                CROSS JOIN generate_series(0, FLOOR(ST_Length(ST_Transform(j.line, 3857)) / 50)::int) as n
                WHERE j.line IS NOT NULL
                AND (n * 50.0) < ST_Length(ST_Transform(j.line, 3857))
            ) segment_data
            WHERE ST_GeometryType(segment_line) = 'ST_LineString'
            AND ST_Length(segment_line) > 0
            ");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jalan_segment');
    }
};

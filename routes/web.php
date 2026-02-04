<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ImportKerusakanJalanController;
use App\Http\Controllers\JenisKerusakanController;
use App\Http\Controllers\KecamatanController;
use App\Http\Controllers\InputDataController;
use App\Http\Controllers\KerusakanJalanController;
use App\Http\Controllers\PetaController;
use App\Http\Controllers\SpatialAnalysisController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('guest.home');
});

Route::controller(AuthController::class)->group(function () {
    Route::get('/login', 'index')->middleware('guest');
    Route::post('/login', 'login')->middleware('guest');
    Route::post('/logout', 'logout')->middleware('auth');
});

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware('admin');

Route::resource('/dashboard/jenis-kerusakan',JenisKerusakanController::class)->middleware('admin');
Route::resource('/dashboard/kecamatan',KecamatanController::class)->middleware('admin');
Route::resource('/dashboard/kerusakan-jalan',KerusakanJalanController::class)->middleware('admin');
Route::get('kerusakan-jalan-export/csv', [KerusakanJalanController::class, 'exportCsv'])
    ->name('kerusakan-jalan.export.csv')->middleware('admin');

Route::controller(InputDataController::class)->group(function () {
    Route::get('/import-kecamatan', 'importGeoJSON');
    Route::get('/view-kecamatan',  'viewKecamatan');
    Route::get('/debug-kecamatan',  'debugGeoJSON');
    Route::get('/update-kecamatan',  'updateKecamatan');
});

Route::get('/peta', [PetaController::class, 'index']);

Route::get('/import-kerusakan-jalan', [ImportKerusakanJalanController::class, 'importCSVRoadDamage']);

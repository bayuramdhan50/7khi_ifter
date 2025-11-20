<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Guru\DashboardController as GuruDashboardController;
use App\Http\Controllers\Orangtua\DashboardController as OrangtuaDashboardController;
use App\Http\Controllers\Siswa\DashboardController as SiswaDashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Siswa Routes
    Route::prefix('siswa')->name('siswa.')->middleware('role:siswa')->group(function () {
        Route::get('dashboard', [SiswaDashboardController::class, 'index'])->name('dashboard');
        Route::get('activity/{activity}', [SiswaDashboardController::class, 'show'])->name('activity.show');
        Route::get('activity/{activity}/history', [SiswaDashboardController::class, 'history'])->name('activity.history');
        Route::get('biodata', [SiswaDashboardController::class, 'biodata'])->name('biodata');
        Route::get('biodata/edit', [SiswaDashboardController::class, 'biodataEdit'])->name('biodata.edit');
        Route::get('lagu', [SiswaDashboardController::class, 'lagu'])->name('lagu');
    });

    // Orangtua Routes
    Route::prefix('orangtua')->name('orangtua.')->middleware('role:orangtua')->group(function () {
        Route::get('dashboard', [OrangtuaDashboardController::class, 'index'])->name('dashboard');
    });

    // Guru Routes
    Route::prefix('guru')->name('guru.')->middleware('role:guru')->group(function () {
        Route::get('dashboard', [GuruDashboardController::class, 'index'])->name('dashboard');
        Route::get('siswa/{student}/activities', [GuruDashboardController::class, 'showStudentActivities'])->name('student.activities');
        Route::get('siswa/{student}/activity/{activity}', [GuruDashboardController::class, 'showStudentActivityDetail'])->name('student.activity.show');
        Route::post('siswa/{student}/activity/{activity}/task/{task}/submit', [GuruDashboardController::class, 'submitStudentTask'])->name('student.activity.task.submit');
        Route::get('siswa/{student}/biodata', [GuruDashboardController::class, 'showStudentBiodata'])->name('student.biodata');
    });

    // Admin Routes
    Route::prefix('admin')->name('admin.')->middleware('role:admin')->group(function () {
        Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    });
});

require __DIR__.'/settings.php';

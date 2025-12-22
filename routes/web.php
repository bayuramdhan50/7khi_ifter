<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Guru\DashboardController as GuruDashboardController;
use App\Http\Controllers\Orangtua\DashboardController as OrangtuaDashboardController;
use App\Http\Controllers\Siswa\DashboardController as SiswaDashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

// Include authentication routes
require __DIR__ . '/auth.php';

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
        Route::get('biodata', [SiswaDashboardController::class, 'biodata'])->name('biodata');
        Route::get('biodata/edit', [SiswaDashboardController::class, 'biodataEdit'])->name('biodata.edit');
        Route::post('biodata/update', [SiswaDashboardController::class, 'biodataUpdate'])->name('biodata.update');
        Route::get('lagu', [SiswaDashboardController::class, 'lagu'])->name('lagu');
        Route::get('kegiatan-harian', [SiswaDashboardController::class, 'kegiatanHarian'])->name('kegiatan-harian');

        // Activity History Routes (MUST be before detail routes to avoid route conflicts)
        Route::get('activities/berbakti/history', [SiswaDashboardController::class, 'berbaktiHistory'])->name('activities.berbakti.history');
        Route::get('activities/{activity}/beribadah/history', [SiswaDashboardController::class, 'beribadahHistory'])->name('activities.beribadah.history');
        Route::get('activities/bangun-pagi/history', [SiswaDashboardController::class, 'bangunPagiHistory'])->name('activities.bangun-pagi.history');
        Route::get('activities/berolahraga/history', [SiswaDashboardController::class, 'berolahragaHistory'])->name('activities.berolahraga.history');
        Route::get('activities/gemar-belajar/history', [SiswaDashboardController::class, 'gemarBelajarHistory'])->name('activities.gemar-belajar.history');
        Route::get('activities/makan-sehat/history', [SiswaDashboardController::class, 'makanSehatHistory'])->name('activities.makan-sehat.history');
        Route::get('activities/bermasyarakat/history', [SiswaDashboardController::class, 'bermasyarakatHistory'])->name('activities.bermasyarakat.history');
        Route::get('activities/tidur-cepat/history', [SiswaDashboardController::class, 'tidurCepatHistory'])->name('activities.tidur-cepat.history');

        // Activity Detail Routes (specific pages for each activity)
        // Note: berbakti route removed - "Berbakti" in database is rendered as beribadah muslim/nonmuslim
        Route::get('activities/beribadah-muslim/{activity}', [SiswaDashboardController::class, 'beribadahMuslimDetail'])->name('activities.beribadah-muslim.detail');
        Route::get('activities/beribadah-nonmuslim/{activity}', [SiswaDashboardController::class, 'beribadahNonmuslimDetail'])->name('activities.beribadah-nonmuslim.detail');
        Route::get('activities/bangun-pagi/{activity}', [SiswaDashboardController::class, 'bangunPagiDetail'])->name('activities.bangun-pagi.detail');
        Route::get('activities/berolahraga/{activity}', [SiswaDashboardController::class, 'berolahragaDetail'])->name('activities.berolahraga.detail');
        Route::get('activities/gemar-belajar/{activity}', [SiswaDashboardController::class, 'gemarBelajarDetail'])->name('activities.gemar-belajar.detail');
        Route::get('activities/makan-sehat/{activity}', [SiswaDashboardController::class, 'makanSehatDetail'])->name('activities.makan-sehat.detail');
        Route::get('activities/bermasyarakat/{activity}', [SiswaDashboardController::class, 'bermasyarakatDetail'])->name('activities.bermasyarakat.detail');
        Route::get('activities/tidur-cepat/{activity}', [SiswaDashboardController::class, 'tidurCepatDetail'])->name('activities.tidur-cepat.detail');

        // Generic activity route (fallback)
        Route::get('activity/{activity}', [SiswaDashboardController::class, 'show'])->name('activity.show');

        // Activity submission routes
        Route::post('activities/bangun-pagi/submit', [SiswaDashboardController::class, 'submitBangunPagi'])->name('activities.bangun-pagi.submit');
        Route::post('activities/submit', [SiswaDashboardController::class, 'submitActivity'])->name('activities.submit');
    });

    // Orangtua Routes
    Route::prefix('orangtua')->name('orangtua.')->middleware('role:orangtua')->group(function () {
        Route::get('dashboard', [OrangtuaDashboardController::class, 'index'])->name('dashboard');
        Route::get('daily-report/detail', [OrangtuaDashboardController::class, 'detail'])->name('daily-report.detail');
        Route::post('submissions/{submission}/approve', [OrangtuaDashboardController::class, 'approve'])->name('submissions.approve');
        Route::post('submissions/{submission}/reject', [OrangtuaDashboardController::class, 'reject'])->name('submissions.reject');
    });

    // Guru Routes
    Route::prefix('guru')->name('guru.')->middleware('role:guru')->group(function () {
        Route::get('dashboard', [GuruDashboardController::class, 'index'])->name('dashboard');
        Route::get('monitoring-aktivitas', [GuruDashboardController::class, 'monitoringAktivitas'])->name('monitoring-aktivitas');
        Route::get('monitoring-siswa', [GuruDashboardController::class, 'monitoringSiswa'])->name('monitoring-siswa');
        Route::get('siswa/{student}/activities', [GuruDashboardController::class, 'showStudentActivities'])->name('student.activities');
        Route::get('siswa/{student}/activities/all', [GuruDashboardController::class, 'showAllActivities'])->name('student.activities.all');
        Route::get('siswa/{student}/activity/{activity}', [GuruDashboardController::class, 'showStudentActivityDetail'])->name('student.activity.show');
        Route::post('siswa/{student}/activity/{activity}/task/{task}/submit', [GuruDashboardController::class, 'submitStudentTask'])->name('student.activity.task.submit');
        Route::get('siswa/{student}/biodata', [GuruDashboardController::class, 'showStudentBiodata'])->name('student.biodata');
    });

    // Admin Routes
    Route::prefix('admin')->name('admin.')->middleware('role:admin')->group(function () {
        Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::get('kelas', [AdminDashboardController::class, 'kelas'])->name('kelas');
        Route::get('users', [AdminDashboardController::class, 'users'])->name('users');

        // Class CRUD API
        Route::post('classes', [\App\Http\Controllers\Admin\ClassController::class, 'store'])->name('classes.store');
        Route::put('classes/{class}', [\App\Http\Controllers\Admin\ClassController::class, 'update'])->name('classes.update');
        Route::delete('classes/{class}', [\App\Http\Controllers\Admin\ClassController::class, 'destroy'])->name('classes.destroy');

        // Siswa Routes
        Route::get('siswa-dashboard', [AdminDashboardController::class, 'siswaDashboard'])->name('siswa.dashboard');
        Route::get('siswa/kelas/{classId}', [AdminDashboardController::class, 'classStudents'])->name('siswa.class');
        Route::get('siswa/kelas/{classId}/create', [AdminDashboardController::class, 'createStudent'])->name('siswa.create');
        Route::get('siswa/create-account', [AdminDashboardController::class, 'createStudentAccount'])->name('siswa.create-account');
        Route::get('siswa-management', [AdminDashboardController::class, 'siswaManagement'])->name('siswa.management');

        // Student CRUD API
        Route::post('students', [\App\Http\Controllers\Admin\StudentController::class, 'store'])->name('students.store');
        Route::put('students/{student}', [\App\Http\Controllers\Admin\StudentController::class, 'update'])->name('students.update');
        Route::put('students/{student}/assign-class', [\App\Http\Controllers\Admin\StudentController::class, 'assignClass'])->name('students.assign-class');
        Route::delete('students/{student}', [\App\Http\Controllers\Admin\StudentController::class, 'destroy'])->name('students.destroy');
        Route::post('students/import', [\App\Http\Controllers\Admin\StudentController::class, 'import'])->name('students.import');

        // Guru Routes
        Route::get('guru-dashboard', [AdminDashboardController::class, 'guruDashboard'])->name('guru.dashboard');
        Route::get('guru-management', [AdminDashboardController::class, 'guruManagement'])->name('guru.management');

        // Teacher CRUD API
        Route::post('teachers', [\App\Http\Controllers\Admin\TeacherController::class, 'store'])->name('teachers.store');
        Route::put('teachers/{teacher}', [\App\Http\Controllers\Admin\TeacherController::class, 'update'])->name('teachers.update');
        Route::delete('teachers/{teacher}', [\App\Http\Controllers\Admin\TeacherController::class, 'destroy'])->name('teachers.destroy');

        // Orang Tua Routes
        Route::get('orangtua-dashboard', [AdminDashboardController::class, 'orangtuaDashboard'])->name('orangtua.dashboard');
        Route::get('orangtua/kelas/{classId}', [AdminDashboardController::class, 'classParents'])->name('orangtua.class');
        Route::get('orangtua/kelas/{classId}/create', [AdminDashboardController::class, 'createParent'])->name('orangtua.create');
        Route::post('orangtua/store', [AdminDashboardController::class, 'storeParent'])->name('orangtua.store');
        Route::get('orangtua/{parentId}/edit', [AdminDashboardController::class, 'editParent'])->name('orangtua.edit');
        Route::put('orangtua/{parentId}/update', [AdminDashboardController::class, 'updateParent'])->name('orangtua.update');
        Route::delete('orangtua/{parentId}/delete', [AdminDashboardController::class, 'deleteParent'])->name('orangtua.delete');
        Route::get('orangtua-management', [AdminDashboardController::class, 'orangtuaManagement'])->name('orangtua.management');
    });
});

require __DIR__ . '/settings.php';

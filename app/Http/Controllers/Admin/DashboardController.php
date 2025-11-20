<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard with classes.
     */
    public function index(): Response
    {
        // TODO: Get classes from database
        // For now, return empty array and let frontend use mock data
        
        return Inertia::render('admin/dashboard', [
            'classes' => [],
        ]);
    }

    /**
     * Display user management page.
     */
    public function users(): Response
    {
        $users = User::orderBy('created_at', 'desc')->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'createdAt' => $user->created_at->format('Y-m-d'),
            ];
        });

        // Hitung statistik per role
        $userStats = [
            'total' => $users->count(),
            'siswa' => $users->where('role', User::ROLE_SISWA)->count(),
            'orangtua' => $users->where('role', User::ROLE_ORANGTUA)->count(),
            'guru' => $users->where('role', User::ROLE_GURU)->count(),
            'admin' => $users->where('role', User::ROLE_ADMIN)->count(),
        ];

        return Inertia::render('admin/users', [
            'users' => $users,
            'userStats' => $userStats,
        ]);
    }

    /**
     * Display siswa dashboard with classes.
     */
    public function siswaDashboard(): Response
    {
        return Inertia::render('admin/siswa-dashboard', [
            'classes' => [],
        ]);
    }

    /**
     * Display students in a specific class.
     */
    public function classStudents(string $classId): Response
    {
        // TODO: Get students from database based on class
        // For now, return empty array and let frontend use mock data
        
        $className = match($classId) {
            '1a' => 'Kelas 1A',
            '1b' => 'Kelas 1B',
            '2a' => 'Kelas 2A',
            '2b' => 'Kelas 2B',
            '3a' => 'Kelas 3A',
            '3b' => 'Kelas 3B',
            '4a' => 'Kelas 4A',
            '4b' => 'Kelas 4B',
            '5a' => 'Kelas 5A',
            '5b' => 'Kelas 5B',
            '6a' => 'Kelas 6A',
            '6b' => 'Kelas 6B',
            default => 'Kelas',
        };

        return Inertia::render('admin/class-students', [
            'className' => $className,
            'classId' => $classId,
            'students' => [],
        ]);
    }

    /**
     * Display siswa management page.
     */
    public function siswaManagement(): Response
    {
        $siswa = User::where('role', User::ROLE_SISWA)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'createdAt' => $user->created_at->format('Y-m-d'),
                ];
            });

        return Inertia::render('admin/siswa-management', [
            'siswa' => $siswa,
            'totalSiswa' => $siswa->count(),
        ]);
    }

    /**
     * Display guru dashboard with teachers list.
     */
    public function guruDashboard(): Response
    {
        // TODO: Get teachers from database
        // For now, return empty array and let frontend use mock data
        
        return Inertia::render('admin/guru-dashboard', [
            'teachers' => [],
        ]);
    }

    /**
     * Display guru management page.
     */
    public function guruManagement(): Response
    {
        $guru = User::where('role', User::ROLE_GURU)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'createdAt' => $user->created_at->format('Y-m-d'),
                ];
            });

        return Inertia::render('admin/guru-management', [
            'guru' => $guru,
            'totalGuru' => $guru->count(),
        ]);
    }

    /**
     * Display orang tua dashboard with classes.
     */
    public function orangtuaDashboard(): Response
    {
        return Inertia::render('admin/orangtua-dashboard', [
            'classes' => [],
        ]);
    }

    /**
     * Display parents in a specific class.
     */
    public function classParents(string $classId): Response
    {
        // TODO: Get parents from database based on class
        // For now, return empty array and let frontend use mock data
        
        $className = match($classId) {
            '1a' => 'Kelas 1A',
            '1b' => 'Kelas 1B',
            '2a' => 'Kelas 2A',
            '2b' => 'Kelas 2B',
            '3a' => 'Kelas 3A',
            '3b' => 'Kelas 3B',
            '4a' => 'Kelas 4A',
            '4b' => 'Kelas 4B',
            '5a' => 'Kelas 5A',
            '5b' => 'Kelas 5B',
            '6a' => 'Kelas 6A',
            '6b' => 'Kelas 6B',
            default => 'Kelas',
        };

        return Inertia::render('admin/class-parents', [
            'className' => $className,
            'classId' => $classId,
            'parents' => [],
        ]);
    }

    /**
     * Display orang tua management page.
     */
    public function orangtuaManagement(): Response
    {
        $orangtua = User::where('role', User::ROLE_ORANGTUA)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'createdAt' => $user->created_at->format('Y-m-d'),
                ];
            });

        return Inertia::render('admin/orangtua-management', [
            'orangtua' => $orangtua,
            'totalOrangTua' => $orangtua->count(),
        ]);
    }
}

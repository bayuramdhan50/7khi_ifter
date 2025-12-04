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
        $classes = \App\Models\ClassModel::withCount('students')
            ->orderBy('grade')
            ->orderBy('section')
            ->get()
            ->map(function ($class) {
                return [
                    'id' => strtolower($class->grade . $class->section), // "1a", "2b", etc.
                    'name' => 'Kelas ' . $class->name, // "Kelas 1A"
                    'studentCount' => $class->students_count,
                ];
            });

        return Inertia::render('admin/siswa-dashboard', [
            'classes' => $classes,
        ]);
    }

    /**
     * Display students in a specific class.
     */
    public function classStudents(string $classId): Response
    {
        // Parse classId (format: "1a", "2b") to get grade and section
        $grade = (int) substr($classId, 0, 1);
        $section = strtoupper(substr($classId, 1));
        
        // Find the class
        $class = \App\Models\ClassModel::where('grade', $grade)
            ->where('section', $section)
            ->first();
            
        if (!$class) {
            abort(404, 'Kelas tidak ditemukan');
        }
        
        $className = 'Kelas ' . $class->name;
        
        // Get students with their user data and biodata
        $students = \App\Models\Student::where('class_id', $class->id)
            ->with(['user', 'biodata'])
            ->get()
            ->map(function ($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->user->name ?? 'N/A',
                    'email' => $student->user->email ?? 'N/A',
                    'nis' => $student->nis ?? 'N/A',
                    'nisn' => $student->nisn ?? 'N/A',
                    'religion' => $student->religion ?? ($student->biodata->religion ?? 'N/A'),
                    'gender' => $student->gender ?? ($student->biodata->gender ?? 'N/A'),
                    'date_of_birth' => $student->date_of_birth?->format('Y-m-d') ?? null,
                    'address' => $student->address ?? 'N/A',
                ];
            });

        return Inertia::render('admin/class-students', [
            'className' => $className,
            'classId' => $classId,
            'classDbId' => $class->id, // Add database ID for API calls
            'students' => $students,
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
        $teachers = \App\Models\Teacher::with(['user', 'classes'])
            ->get()
            ->map(function ($teacher) {
                $assignedClass = $teacher->classes->first();
                return [
                    'id' => $teacher->id,
                    'user_id' => $teacher->user_id,
                    'name' => $teacher->user->name ?? 'N/A',
                    'email' => $teacher->user->email ?? 'N/A',
                    'nip' => $teacher->nip ?? '-',
                    'phone' => $teacher->phone ?? '-',
                    'address' => $teacher->address ?? '-',
                    'is_active' => $teacher->is_active,
                    'class_id' => $assignedClass ? $assignedClass->id : null,
                    'class_name' => $assignedClass ? $assignedClass->name : '-',
                    'createdAt' => $teacher->created_at->format('d/m/Y'),
                ];
            });
        
        // Get all classes for the dropdown
        $allClasses = \App\Models\ClassModel::orderBy('grade')
            ->orderBy('section')
            ->get()
            ->map(function ($class) {
                return [
                    'id' => $class->id,
                    'name' => $class->name,
                    'grade' => $class->grade,
                    'section' => $class->section,
                ];
            });
        
        return Inertia::render('admin/guru-dashboard', [
            'teachers' => $teachers,
            'allClasses' => $allClasses,
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
        $classes = \App\Models\ClassModel::orderBy('grade')
            ->orderBy('section')
            ->get()
            ->map(function ($class) {
                // Count parents through students in this class
                $parentCount = \App\Models\Student::where('class_id', $class->id)
                    ->with('parents')
                    ->get()
                    ->pluck('parents')
                    ->flatten()
                    ->unique('id')
                    ->count();
                
                return [
                    'id' => strtolower($class->grade . $class->section),
                    'name' => 'Kelas ' . $class->name,
                    'parentCount' => $parentCount,
                ];
            });

        return Inertia::render('admin/orangtua-dashboard', [
            'classes' => $classes,
        ]);
    }

    /**
     * Display parents in a specific class.
     */
    public function classParents(string $classId): Response
    {
        // Parse classId (format: "1a", "2b") to get grade and section
        $grade = (int) substr($classId, 0, 1);
        $section = strtoupper(substr($classId, 1));
        
        // Find the class
        $class = \App\Models\ClassModel::where('grade', $grade)
            ->where('section', $section)
            ->first();
            
        if (!$class) {
            abort(404, 'Kelas tidak ditemukan');
        }
        
        $className = 'Kelas ' . $class->name;
        
        // Get parents through students in this class
        $students = \App\Models\Student::where('class_id', $class->id)
            ->with(['parents.user'])
            ->get();
            
        $parentsCollection = collect();
        foreach ($students as $student) {
            foreach ($student->parents as $parent) {
                if (!$parentsCollection->contains('id', $parent->id)) {
                    $parentsCollection->push([
                        'id' => $parent->id,
                        'name' => $parent->user->name ?? 'N/A',
                        'email' => $parent->user->email ?? 'N/A',
                        'phone' => $parent->phone ?? 'N/A',
                        'studentName' => $student->user->name ?? 'N/A',
                    ]);
                }
            }
        }

        return Inertia::render('admin/class-parents', [
            'className' => $className,
            'classId' => $classId,
            'parents' => $parentsCollection->values(),
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

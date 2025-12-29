<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ParentModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard with statistics.
     */
    public function index(): Response
    {
        $stats = [
            'totalSiswa' => User::where('role', User::ROLE_SISWA)->count(),
            'totalGuru' => User::where('role', User::ROLE_GURU)->count(),
            'totalOrangtua' => User::where('role', User::ROLE_ORANGTUA)->count(),
            'totalKelas' => \App\Models\ClassModel::count(),
        ];

        return Inertia::render('admin/beranda/dashboard', [
            'stats' => $stats,
        ]);
    }

    /**
     * Display the classes page.
     */
    public function kelas(): Response
    {
        $classes = \App\Models\ClassModel::withCount('students')
            ->orderBy('grade')
            ->orderBy('section')
            ->get();

        return Inertia::render('admin/kelas/kelas', [
            'classes' => $classes,
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

        return Inertia::render('admin/kelolapengguna/users', [
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

        return Inertia::render('admin/manajemen/siswa/dashboard/siswa-dashboard', [
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
                    'nis' => $student->nis ?? 'N/A',
                    'nisn' => $student->nisn ?? 'N/A',
                    'religion' => $student->user->religion ?? 'N/A',
                    'gender' => $student->gender ?? ($student->biodata->gender ?? 'N/A'),
                    'date_of_birth' => $student->date_of_birth?->format('Y-m-d') ?? null,
                    'address' => $student->address ?? 'N/A',
                ];
            });

        return Inertia::render('admin/kelas/student/class-students', [
            'className' => $className,
            'classId' => $classId,
            'classDbId' => $class->id, // Add database ID for API calls
            'students' => $students,
        ]);
    }

    /**
     * Display create student page for a specific class.
     */
    public function createStudent(string $classId): Response
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

        // Get students without class (unassigned)
        $unassignedStudents = \App\Models\Student::whereNull('class_id')
            ->with('user')
            ->get()
            ->map(function ($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->user->name ?? 'N/A',
                    'nis' => $student->nis ?? 'N/A',
                    'nisn' => $student->nisn ?? 'N/A',
                    'religion' => $student->user->religion ?? 'N/A',
                    'gender' => $student->gender ?? 'N/A',
                ];
            });

        return Inertia::render('admin/kelas/student/create-student', [
            'className' => $className,
            'classId' => $classId,
            'classDbId' => $class->id,
            'unassignedStudents' => $unassignedStudents,
        ]);
    }

    /**
     * Display create account page for students.
     */
    public function createStudentAccount(): Response
    {
        $classes = \App\Models\ClassModel::orderBy('grade')
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

        return Inertia::render('admin/student/create-account', [
            'classes' => $classes,
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
                    'createdAt' => $user->created_at->format('Y-m-d'),
                ];
            });

        return Inertia::render('admin/manajemen/siswa/management/siswa-management', [
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

        return Inertia::render('admin/manajemen/guru/dashboard/guru-dashboard', [
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
                    'createdAt' => $user->created_at->format('Y-m-d'),
                ];
            });

        return Inertia::render('admin/manajemen/guru/management/guru-management', [
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

        return Inertia::render('admin/manajemen/orangtua/dashboard/orangtua-dashboard', [
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

        // Get parents in two ways:
        // 1. Parents directly assigned to this class (via class_id)
        // 2. Parents linked to students in this class  
        $parentsViaClassId = \App\Models\ParentModel::where('class_id', $class->id)
            ->with(['user', 'students.user'])
            ->get();

        // Get parents through students in this class
        $students = \App\Models\Student::where('class_id', $class->id)
            ->with(['parents.user', 'user'])
            ->get();

        $parentsMap = [];

        // Add parents directly assigned to class
        foreach ($parentsViaClassId as $parent) {
            $childrenNames = $parent->students->pluck('user.name')->filter()->implode(', ');

            $parentsMap[$parent->id] = [
                'id' => $parent->id,
                'parentName' => $parent->user->name ?? 'N/A',
                'phone' => $parent->phone ?? 'N/A',
                'studentName' => $childrenNames ?: null,
                'studentClass' => $class->name ?? 'N/A',
            ];
        }

        // Add or update parents linked to students in this class
        foreach ($students as $student) {
            foreach ($student->parents as $parent) {
                if (isset($parentsMap[$parent->id])) {
                    // Parent already exists, update student names if needed
                    $existingNames = $parentsMap[$parent->id]['studentName'];
                    $studentName = $student->user->name ?? 'N/A';

                    if ($existingNames && !str_contains($existingNames, $studentName)) {
                        $parentsMap[$parent->id]['studentName'] = $existingNames . ', ' . $studentName;
                    } elseif (!$existingNames) {
                        $parentsMap[$parent->id]['studentName'] = $studentName;
                    }
                } else {
                    // New parent, add to map
                    $parentsMap[$parent->id] = [
                        'id' => $parent->id,
                        'parentName' => $parent->user->name ?? 'N/A',
                        'phone' => $parent->phone ?? 'N/A',
                        'studentName' => $student->user->name ?? 'N/A',
                        'studentClass' => $class->name ?? 'N/A',
                    ];
                }
            }
        }

        $parentsCollection = collect(array_values($parentsMap));

        return Inertia::render('admin/kelas/parent/class-parents', [
            'className' => $className,
            'classId' => $classId,
            'classDbId' => $class->id,
            'parents' => $parentsCollection->values(),
            'allClasses' => \App\Models\ClassModel::with(['students.user'])
                ->get()
                ->map(function ($class) {
                    return [
                        'id' => $class->id,
                        'name' => $class->name,
                        'students' => $class->students->map(function ($student) {
                            return [
                                'id' => $student->id,
                                'name' => $student->user->name ?? 'N/A',
                                'class_id' => $student->class_id,
                            ];
                        }),
                    ];
                }),
        ]);
    }

    /**
     * Display create parent form.
     */
    public function createParent(string $classId): Response
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

        return Inertia::render('admin/kelas/parent/create-parent', [
            'className' => $className,
            'classId' => $classId,
            'allClasses' => \App\Models\ClassModel::with(['students.user'])
                ->get()
                ->map(function ($class) {
                    return [
                        'id' => $class->id,
                        'name' => $class->name,
                        'students' => $class->students->map(function ($student) {
                            return [
                                'id' => $student->id,
                                'name' => $student->user->name ?? 'N/A',
                                'class_id' => $student->class_id,
                            ];
                        }),
                    ];
                }),
        ]);
    }

    /**
     * Store parent data to database.
     */
    public function storeParent(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:50|unique:users,username',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'occupation' => 'nullable|string|max:100',
            'children' => 'required|array|min:1',
            'children.*.classId' => 'required|exists:classes,id',
            'children.*.studentId' => 'required|exists:students,id',
            'children.*.relationship' => 'required|in:ayah,ibu,wali',
        ]);

        try {
            DB::beginTransaction();

            // 1. Create User account for parent
            $user = User::create([
                'name' => $validated['name'],
                'username' => $validated['username'],
                'password' => Hash::make('password123'), // Default password
                'role' => User::ROLE_ORANGTUA,
            ]);

            // 2. Create Parent record
            $parent = ParentModel::create([
                'user_id' => $user->id,
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'occupation' => $validated['occupation'],
            ]);

            // 3. Attach students to parent with relationship
            foreach ($validated['children'] as $child) {
                DB::table('parent_student')->insert([
                    'parent_id' => $parent->id,
                    'student_id' => $child['studentId'],
                    'relationship' => $child['relationship'],
                    'is_primary' => false, // Set first child as primary if needed
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            DB::commit();

            return redirect()
                ->route('admin.orangtua.class', ['classId' => $request->input('classId')])
                ->with('success', 'Akun orang tua berhasil dibuat!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()
                ->withErrors(['error' => 'Gagal membuat akun: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Display edit parent form.
     */
    public function editParent(int $parentId): Response
    {
        // Find the parent with user and students relationships
        $parent = ParentModel::with(['user', 'students.user', 'students.class'])
            ->findOrFail($parentId);

        // Map parent data with children
        $parentData = [
            'id' => $parent->id,
            'name' => $parent->user->name,
            'username' => $parent->user->username,
            'phone' => $parent->phone,
            'address' => $parent->address,
            'occupation' => $parent->occupation,
            'children' => $parent->students->map(function ($student, $index) {
                $relationship = DB::table('parent_student')
                    ->where('parent_id', $student->pivot->parent_id)
                    ->where('student_id', $student->id)
                    ->value('relationship');

                return [
                    'id' => $index + 1,
                    'classId' => $student->class_id,
                    'studentId' => $student->id,
                    'relationship' => $relationship ?? 'ayah',
                ];
            })->values()->toArray(),
        ];

        // Get classId from query parameter if provided
        $classId = request()->query('classId', null);

        // Determine className if classId is provided
        $className = '';
        if ($classId) {
            // Parse classId (format: "1a", "2b")
            $grade = (int) substr($classId, 0, 1);
            $section = strtoupper(substr($classId, 1));

            $class = \App\Models\ClassModel::where('grade', $grade)
                ->where('section', $section)
                ->first();

            if ($class) {
                $className = 'Kelas ' . $class->name;
            }
        }

        // Get all classes with students
        $allClasses = \App\Models\ClassModel::with(['students.user'])
            ->get()
            ->map(function ($class) {
                return [
                    'id' => $class->id,
                    'name' => $class->name,
                    'students' => $class->students->map(function ($student) {
                        return [
                            'id' => $student->id,
                            'name' => $student->user->name ?? 'N/A',
                            'class_id' => $student->class_id,
                        ];
                    }),
                ];
            });

        return Inertia::render('admin/kelas/parent/edit-parent', [
            'parent' => $parentData,
            'classId' => $classId,
            'className' => $className,
            'allClasses' => $allClasses,
        ]);
    }

    /**
     * Update parent data in database.
     */
    public function updateParent(Request $request, int $parentId)
    {
        $parent = ParentModel::with('user')->findOrFail($parentId);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => [
                'required',
                'string',
                'max:50',
                'unique:users,username,' . $parent->user_id,
            ],
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'occupation' => 'nullable|string|max:100',
            'children' => 'required|array|min:1',
            'children.*.classId' => 'required|exists:classes,id',
            'children.*.studentId' => 'required|exists:students,id',
            'children.*.relationship' => 'required|in:ayah,ibu,wali',
        ]);

        try {
            DB::beginTransaction();

            // Log request data for debugging
            \Log::info('Updating parent', [
                'parent_id' => $parent->id,
                'validated_data' => $validated,
            ]);

            // 1. Update User account
            $parent->user->update([
                'name' => $validated['name'],
                'username' => $validated['username'],
            ]);

            // 2. Update Parent record
            $parent->update([
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'occupation' => $validated['occupation'],
            ]);

            // 3. Sync students - delete old relationships and insert new ones
            DB::table('parent_student')
                ->where('parent_id', $parent->id)
                ->delete();

            foreach ($validated['children'] as $child) {
                \Log::info('Inserting parent-student relationship', [
                    'parent_id' => $parent->id,
                    'student_id' => $child['studentId'],
                    'relationship' => $child['relationship'],
                ]);

                DB::table('parent_student')->insert([
                    'parent_id' => $parent->id,
                    'student_id' => $child['studentId'],
                    'relationship' => $child['relationship'],
                    'is_primary' => false,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            DB::commit();

            // Redirect back to class parents page
            $classId = $request->input('classId');
            if ($classId) {
                return redirect()
                    ->route('admin.orangtua.class', ['classId' => $classId])
                    ->with('success', 'Data orang tua berhasil diperbarui!');
            }

            return redirect()
                ->route('admin.orangtua.dashboard')
                ->with('success', 'Data orang tua berhasil diperbarui!');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to update parent', [
                'parent_id' => $parentId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'Gagal mengupdate data: ' . $e->getMessage()]);
        }
    }

    /**
     * Delete parent account.
     */
    public function deleteParent(int $parentId)
    {
        try {
            DB::beginTransaction();

            // Find parent with user
            $parent = ParentModel::with('user')->findOrFail($parentId);
            $user = $parent->user;

            // 1. Delete parent_student relationships
            DB::table('parent_student')
                ->where('parent_id', $parent->id)
                ->delete();

            // 2. Delete parent record
            $parent->delete();

            // 3. Delete user account
            $user->delete();

            DB::commit();

            return redirect()
                ->back()
                ->with('success', 'Akun orang tua berhasil dihapus!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()
                ->withErrors(['error' => 'Gagal menghapus akun: ' . $e->getMessage()]);
        }
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
                    'createdAt' => $user->created_at->format('Y-m-d'),
                ];
            });

        return Inertia::render('admin/manajemen/orangtua/management/orangtua-management', [
            'orangtua' => $orangtua,
            'totalOrangTua' => $orangtua->count(),
        ]);
    }
}

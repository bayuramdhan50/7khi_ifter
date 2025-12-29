<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ClassModel;
use App\Models\Student;
use App\Models\Activity;
use App\Models\ActivitySubmission;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the guru dashboard.
     */
    public function index(): Response
    {
        $currentUser = auth()->user();
        
        // Get classes taught by this teacher
        $teacherClasses = ClassModel::where('teacher_id', $currentUser->id)
            ->with(['students.user', 'students.biodata'])
            ->orderBy('name')
            ->get();

        // Prepare classes data with student count and academic year
        $classesData = $teacherClasses->map(function ($class) {
            return [
                'id' => $class->id,
                'name' => $class->name,
                'grade' => $class->grade,
                'section' => $class->section,
                'academic_year' => $class->academic_year,
                'student_count' => $class->students->count(),
            ];
        });

        // Get selected class from request or use the first one
        $selectedClassId = request()->query('class_id');
        
        if ($selectedClassId) {
            $selectedClass = $teacherClasses->firstWhere('id', (int)$selectedClassId);
        } else {
            $selectedClass = $teacherClasses->first();
        }

        // Collect all students from selected class
        $students = [];
        $studentJournals = [];

        if ($selectedClass) {
            foreach ($selectedClass->students as $student) {
                $studentUser = $student->user;
                if ($studentUser) {
                    $studentData = [
                        'id' => $studentUser->id,
                        'name' => strtoupper($studentUser->name),
                        'class' => $selectedClass->name,
                        'nis' => $student->nis ?? '-',
                        'religion' => $studentUser->religion ?? 'ISLAM',
                        'gender' => $student->gender ?? 'L',
                        'progress' => $this->getStudentProgress($student->id),
                    ];
                    
                    $students[] = $studentData;

                    // Get recent activity submissions for this student
                    $submissions = ActivitySubmission::where('student_id', $student->id)
                        ->with('activity')
                        ->orderBy('date', 'desc')
                        ->limit(5)
                        ->get()
                        ->map(function ($submission) {
                            return [
                                'id' => $submission->id,
                                'activity' => $submission->activity->title ?? 'Activity',
                                'date' => $submission->date->format('d/m/Y'),
                                'status' => $submission->status,
                                'notes' => $submission->notes,
                            ];
                        });

                    $studentJournals[$studentUser->id] = $submissions;
                }
            }
        }

        $selectedClassData = $selectedClass ? [
            'id' => $selectedClass->id,
            'name' => $selectedClass->name,
            'grade' => $selectedClass->grade,
            'section' => $selectedClass->section,
            'academic_year' => $selectedClass->academic_year,
            'student_count' => $selectedClass->students->count(),
        ] : null;

        return Inertia::render('guru/dashboard', [
            'classes' => $classesData,
            'selectedClass' => $selectedClassData,
            'students' => $students,
            'studentJournals' => $studentJournals,
        ]);
    }

    /**
     * Display student activities for viewing.
     */
    public function showStudentActivities(int $studentId): Response
    {
        $user = User::findOrFail($studentId);
        $student = Student::where('user_id', $studentId)->firstOrFail();

        // Get all activities from database ordered by order column
        $activitiesFromDb = Activity::orderBy('order')->get();
        
        $activities = $activitiesFromDb->map(function ($activity) use ($student) {
            // Check if student has submitted this activity today
            $todaySubmission = ActivitySubmission::where('student_id', $student->id)
                ->where('activity_id', $activity->id)
                ->whereDate('date', today())
                ->where('status', 'approved')
                ->exists();

            return [
                'id' => $activity->id,
                'title' => $activity->title,
                'icon' => $activity->icon,
                'color' => $activity->color,
                'completed' => $todaySubmission,
            ];
        })->toArray();

        return Inertia::render('guru/student-activities', [
            'student' => [
                'id' => $user->id,
                'name' => $user->name,
                'religion' => $student->user->religion ?? 'ISLAM',
                'gender' => $student->gender ?? 'L',
                'progress' => $this->getStudentProgress($student->id),
            ],
            'activities' => $activities,
        ]);
    }

    /**
     * Display all activities with all submissions for a student
     */
    public function showAllActivities(int $studentId): Response
    {
        $user = User::findOrFail($studentId);
        $student = Student::where('user_id', $studentId)->firstOrFail();

        // Get all activities from database ordered by order column
        $activitiesFromDb = Activity::orderBy('order')->get();

        // Get month and year from request or use current month
        $requestedMonth = request()->query('month', now()->month);
        $requestedYear = request()->query('year', now()->year);
        
        $currentMonth = (int) $requestedMonth;
        $currentYear = (int) $requestedYear;
        
        // Calculate days in the requested month
        $daysInMonth = cal_days_in_month(CAL_GREGORIAN, $currentMonth, $currentYear);

        // Get all submissions for this student in requested month
        $allSubmissions = ActivitySubmission::where('student_id', $student->id)
            ->whereMonth('date', $currentMonth)
            ->whereYear('date', $currentYear)
            ->with('activity')
            ->orderBy('date', 'asc')
            ->get();

        // Group submissions by activity_id and date
        $submissionsByActivity = $allSubmissions->groupBy('activity_id');

        // Build activities with their submissions
        $activitiesWithSubmissions = $activitiesFromDb->map(function ($activity) use ($student, $daysInMonth, $currentMonth, $currentYear, $submissionsByActivity) {
            $activitySubmissions = $submissionsByActivity->get($activity->id, collect());
            
            // Create submission map keyed by day
            $submissionsByDay = $activitySubmissions->keyBy(function($item) {
                return $item->date->day;
            });

            // Generate all days in month with submission data
            $dailyData = [];
            for ($day = 1; $day <= $daysInMonth; $day++) {
                $submission = $submissionsByDay->get($day);
                
                $dailyData[] = [
                    'day' => $day,
                    'date' => sprintf('%04d-%02d-%02d', $currentYear, $currentMonth, $day),
                    'status' => $submission ? $submission->status : 'not_submitted',
                    'time' => $submission ? $submission->time : null,
                    'notes' => $submission ? $submission->notes : null,
                    'photo' => $submission ? $submission->photo : null,
                    'approved_at' => $submission ? $submission->approved_at : null,
                ];
            }

            // Calculate stats for this activity
            $approvedCount = $activitySubmissions->where('status', 'approved')->count();
            $pendingCount = $activitySubmissions->where('status', 'pending')->count();
            $rejectedCount = $activitySubmissions->where('status', 'rejected')->count();

            return [
                'id' => $activity->id,
                'title' => $activity->title,
                'icon' => $activity->icon,
                'color' => $activity->color,
                'submissions' => $dailyData,
                'stats' => [
                    'approved' => $approvedCount,
                    'pending' => $pendingCount,
                    'rejected' => $rejectedCount,
                    'total' => $activitySubmissions->count(),
                ],
            ];
        })->toArray();

        // Get month name in Indonesian
        $monthNames = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
        ];

        return Inertia::render('guru/student-all-activities', [
            'student' => [
                'id' => $user->id,
                'name' => $user->name,
                'religion' => $student->user->religion ?? 'ISLAM',
                'gender' => $student->gender ?? 'L',
                'progress' => $this->getStudentProgress($student->id),
            ],
            'activities' => $activitiesWithSubmissions,
            'month' => $monthNames[$currentMonth] ?? 'Desember',
            'year' => $currentYear,
            'daysInMonth' => $daysInMonth,
        ]);
    }

    /**
     * Calculate student progress percentage for current month.
     * Formula: (Total approved submissions this month / Total days in month × 7 activities) × 100
     */
    private function getStudentProgress(int $studentId): int
    {
        $startOfMonth = now()->startOfMonth();
        $endOfMonth = now()->endOfMonth();
        $daysInMonth = $endOfMonth->day;

        // Get total APPROVED submissions for this month
        $actualSubmissions = ActivitySubmission::where('student_id', $studentId)
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->where('status', 'approved')
            ->count();

        // Total possible submissions = days in month × 7 activities
        $totalPossible = $daysInMonth * 7;

        if ($totalPossible === 0) {
            return 0;
        }

        return (int)round(($actualSubmissions / $totalPossible) * 100);
    }

    /**
     * Display student activity detail page for input.
     */
    public function showStudentActivityDetail(int $studentId, int $activityId): Response
    {
        $user = User::where('role', User::ROLE_SISWA)->findOrFail($studentId);
        $studentModel = Student::where('user_id', $studentId)->firstOrFail();

        // Get activity from database
        $activity = Activity::findOrFail($activityId);

        // Get current month data
        $currentMonth = now()->month;
        $currentYear = now()->year;
        $daysInMonth = now()->daysInMonth;
        
        // Get activity submissions for this month
        $submissions = ActivitySubmission::where('student_id', $studentModel->id)
            ->where('activity_id', $activityId)
            ->whereMonth('date', $currentMonth)
            ->whereYear('date', $currentYear)
            ->get()
            ->keyBy(function($item) {
                return $item->date->day;
            });

        // Generate tasks for all days in current month
        $tasks = [];
        for ($day = 1; $day <= $daysInMonth; $day++) {
            $submission = $submissions->get($day);
            
            $tasks[] = [
                'id' => $submission->id ?? 0,
                'tanggal' => $day,
                'date' => sprintf('%04d-%02d-%02d', $currentYear, $currentMonth, $day),
                'waktu' => $submission ? $submission->time : null,
                'notes' => $submission ? $submission->notes : null,
                'status' => $submission ? $submission->status : 'not_submitted',
                'approval_orangtua' => $submission ? ($submission->status === 'approved') : false,
                'bukti_foto' => $submission ? $submission->photo : null,
                'approved_by' => $submission ? $submission->approved_by : null,
                'approved_at' => $submission ? $submission->approved_at : null,
                'rejection_reason' => $submission ? $submission->rejection_reason : null,
            ];
        }

        return Inertia::render('guru/student-activity-detail', [
            'student' => [
                'id' => $user->id,
                'name' => $user->name,
            ],
            'activity' => [
                'id' => $activity->id,
                'title' => $activity->title,
                'icon' => $activity->icon,
                'color' => $activity->color,
                'month' => now()->locale('id')->translatedFormat('F'),
                'year' => $currentYear,
                'tasks' => $tasks,
            ],
        ]);
    }

    /**
     * Submit student activity task.
     */
    public function submitStudentTask(int $studentId, int $activityId, int $taskId)
    {
        // TODO: Save task submission to database
        
        return redirect()->back()->with('success', 'Task berhasil disubmit!');
    }

    /**
     * Display student biodata page.
     */
    public function showStudentBiodata(int $studentId): Response
    {
        $user = User::findOrFail($studentId);
        $student = Student::where('user_id', $studentId)->firstOrFail();
        $biodata = $student->biodata;

        $biodataArray = $biodata ? [
            'hobbies' => array_filter(explode(',', $biodata->hobi ?? '')),
            'aspirations' => array_filter([$biodata->cita_cita ?? '']),
            'favorite_foods' => array_filter([$biodata->makanan_kesukaan ?? '']),
            'disliked_foods' => [],
            'favorite_animals' => array_filter([$biodata->hewan_kesukaan ?? '']),
            'disliked_items' => array_filter(explode(',', $biodata->sesuatu_tidak_suka ?? '')),
            'favorite_drinks' => array_filter([$biodata->minuman_kesukaan ?? '']),
        ] : [
            'hobbies' => [],
            'aspirations' => [],
            'favorite_foods' => [],
            'disliked_foods' => [],
            'favorite_animals' => [],
            'disliked_items' => [],
            'favorite_drinks' => [],
        ];

        return Inertia::render('guru/student-biodata', [
            'student' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email ?? '-',
                'religion' => $student->user->religion ?? '-',
                'gender' => $student->gender ?? '-',
                'nis' => $student->nis ?? '-',
                'birth_date' => $student->date_of_birth ? $student->date_of_birth->format('d-m-Y') : '-',
                'address' => $student->address ?? '-',
                'photo' => $student->photo ?? null,
            ],
            'biodata' => $biodataArray,
        ]);
    }

    /**
     * Display monitoring aktivitas page
     */
    public function monitoringAktivitas(): Response
    {
        $currentUser = auth()->user();
        
        // Get classes taught by this teacher
        $teacherClasses = ClassModel::where('teacher_id', $currentUser->id)
            ->with(['students'])
            ->orderBy('name')
            ->get();

        // Prepare classes data with student count and academic year
        $classesData = $teacherClasses->map(function ($class) {
            return [
                'id' => $class->id,
                'name' => $class->name,
                'grade' => $class->grade,
                'section' => $class->section,
                'academic_year' => $class->academic_year,
                'student_count' => $class->students->count(),
            ];
        });

        // Get selected class from request or use the first one
        $selectedClassId = request()->query('class_id');
        
        if ($selectedClassId) {
            $selectedClass = $teacherClasses->firstWhere('id', (int)$selectedClassId);
        } else {
            $selectedClass = $teacherClasses->first();
        }

        $selectedClassData = $selectedClass ? [
            'id' => $selectedClass->id,
            'name' => $selectedClass->name,
            'grade' => $selectedClass->grade,
            'section' => $selectedClass->section,
            'academic_year' => $selectedClass->academic_year,
            'student_count' => $selectedClass->students->count(),
        ] : null;

        // Calculate activity statistics for selected class
        $activityStats = [];
        if ($selectedClass) {
            // Get month and year filter (default: current month)
            $selectedMonth = request()->query('month', now()->month);
            $selectedYear = request()->query('year', now()->year);
            
            // Determine date range based on month and year
            $startDate = \Carbon\Carbon::create($selectedYear, $selectedMonth, 1)->startOfMonth();
            $endDate = \Carbon\Carbon::create($selectedYear, $selectedMonth, 1)->endOfMonth();
            
            // Get all activities
            $activities = Activity::orderBy('order')->get();
            
            // Get student IDs from selected class
            $studentIds = $selectedClass->students->pluck('id')->toArray();
            
            // Calculate stats for each activity (only approved submissions)
            foreach ($activities as $activity) {
                $totalSubmissions = ActivitySubmission::whereIn('student_id', $studentIds)
                    ->where('activity_id', $activity->id)
                    ->whereBetween('date', [$startDate, $endDate])
                    ->where('status', 'approved')
                    ->count();
                
                $totalStudents = count($studentIds);
                
                // Calculate expected submissions based on period
                $daysInPeriod = $startDate->diffInDays($endDate) + 1;
                $expectedSubmissions = $totalStudents * $daysInPeriod;
                
                // Calculate actual students who submitted (approved only)
                $siswaAktif = ActivitySubmission::whereIn('student_id', $studentIds)
                    ->where('activity_id', $activity->id)
                    ->whereBetween('date', [$startDate, $endDate])
                    ->where('status', 'approved')
                    ->distinct('student_id')
                    ->count('student_id');
                
                $persentase = $totalStudents > 0 ? round(($siswaAktif / $totalStudents) * 100) : 0;
                
                // Map activity colors
                $colorMap = [
                    'bg-orange-100' => ['bg' => 'bg-orange-50', 'border' => 'border-orange-200', 'text' => 'text-orange-700', 'progress' => 'bg-orange-500'],
                    'bg-blue-100' => ['bg' => 'bg-blue-50', 'border' => 'border-blue-200', 'text' => 'text-blue-700', 'progress' => 'bg-blue-500'],
                    'bg-green-100' => ['bg' => 'bg-green-50', 'border' => 'border-green-200', 'text' => 'text-green-700', 'progress' => 'bg-green-500'],
                    'bg-yellow-100' => ['bg' => 'bg-yellow-50', 'border' => 'border-yellow-200', 'text' => 'text-yellow-700', 'progress' => 'bg-yellow-500'],
                    'bg-pink-100' => ['bg' => 'bg-pink-50', 'border' => 'border-pink-200', 'text' => 'text-pink-700', 'progress' => 'bg-pink-500'],
                    'bg-purple-100' => ['bg' => 'bg-purple-50', 'border' => 'border-purple-200', 'text' => 'text-purple-700', 'progress' => 'bg-purple-500'],
                    'bg-indigo-100' => ['bg' => 'bg-indigo-50', 'border' => 'border-indigo-200', 'text' => 'text-indigo-700', 'progress' => 'bg-indigo-500'],
                ];
                
                $colors = $colorMap[$activity->color] ?? ['bg' => 'bg-gray-50', 'border' => 'border-gray-200', 'text' => 'text-gray-700', 'progress' => 'bg-gray-500'];
                
                $activityStats[] = [
                    'id' => $activity->id,
                    'nama' => $activity->title,
                    'icon' => $activity->icon,
                    'totalSiswa' => $totalStudents,
                    'siswaAktif' => $siswaAktif,
                    'persentase' => $persentase,
                    'bgColor' => $colors['bg'],
                    'borderColor' => $colors['border'],
                    'textColor' => $colors['text'],
                    'progressColor' => $colors['progress'],
                ];
            }
        }

        return Inertia::render('guru/monitoring-aktivitas', [
            'classes' => $classesData,
            'selectedClass' => $selectedClassData,
            'activityStats' => $activityStats,
            'selectedMonth' => (int) request()->query('month', now()->month),
            'selectedYear' => (int) request()->query('year', now()->year),
        ]);
    }

    /**
     * Display monitoring per siswa page
     */
    public function monitoringSiswa(): Response
    {
        $currentUser = auth()->user();
        
        // Get classes taught by this teacher
        $teacherClasses = ClassModel::where('teacher_id', $currentUser->id)
            ->with(['students.user'])
            ->orderBy('name')
            ->get();

        // Prepare classes data
        $classesData = $teacherClasses->map(function ($class) {
            return [
                'id' => $class->id,
                'name' => $class->name,
                'grade' => $class->grade,
                'section' => $class->section,
                'academic_year' => $class->academic_year,
                'student_count' => $class->students->count(),
            ];
        });

        // Get selected class from request or use the first one
        $selectedClassId = request()->query('class_id');
        
        if ($selectedClassId) {
            $selectedClass = $teacherClasses->firstWhere('id', (int)$selectedClassId);
        } else {
            $selectedClass = $teacherClasses->first();
        }

        // Collect students from selected class only
        $students = [];
        if ($selectedClass) {
            foreach ($selectedClass->students as $student) {
                $studentUser = $student->user;
                if ($studentUser) {
                    $students[] = [
                        'id' => $studentUser->id,
                        'student_id' => $student->id,
                        'name' => strtoupper($studentUser->name),
                        'nis' => $student->nis ?? '-',
                        'class' => $selectedClass->name,
                    ];
                }
            }
        }

        // Get selected student from request
        $selectedStudentId = request()->query('student_id');
        $selectedStudent = null;
        $monthlyProgress = [];
        
        if ($selectedStudentId) {
            $selectedStudent = collect($students)->firstWhere('id', (int)$selectedStudentId);
            
            if ($selectedStudent) {
                // Get current month's date range
                $startOfMonth = now()->startOfMonth();
                $endOfMonth = now()->endOfMonth();
                $daysInMonth = $endOfMonth->day;
                
                // Get all activities
                $activities = Activity::orderBy('order')->get();
                
                // Calculate monthly progress for each activity
                foreach ($activities as $activity) {
                    $submissions = ActivitySubmission::where('student_id', $selectedStudent['student_id'])
                        ->where('activity_id', $activity->id)
                        ->whereBetween('date', [$startOfMonth, $endOfMonth])
                        ->where('status', 'approved')
                        ->count();
                    
                    $percentage = round(($submissions / $daysInMonth) * 100);
                    
                    // Determine status
                    if ($percentage === 100) {
                        $status = 'Sangat Baik';
                        $color = 'bg-green-500';
                    } elseif ($percentage >= 75) {
                        $status = 'Baik';
                        $color = 'bg-blue-500';
                    } elseif ($percentage >= 50) {
                        $status = 'Cukup';
                        $color = 'bg-yellow-500';
                    } else {
                        $status = 'Kurang';
                        $color = 'bg-red-500';
                    }
                    
                    $monthlyProgress[] = [
                        'activityName' => $activity->title,
                        'percentage' => $percentage,
                        'daysCompleted' => $submissions,
                        'totalDays' => $daysInMonth,
                        'status' => $status,
                        'color' => $color,
                    ];
                }
            }
        }

        $selectedClassData = $selectedClass ? [
            'id' => $selectedClass->id,
            'name' => $selectedClass->name,
            'grade' => $selectedClass->grade,
            'section' => $selectedClass->section,
            'academic_year' => $selectedClass->academic_year,
            'student_count' => $selectedClass->students->count(),
        ] : null;

        return Inertia::render('guru/monitoring-siswa', [
            'classes' => $classesData,
            'selectedClass' => $selectedClassData,
            'students' => $students,
            'selectedStudent' => $selectedStudent,
            'monthlyProgress' => $monthlyProgress,
            'selectedMonth' => now()->locale('id')->translatedFormat('F'),
            'selectedYear' => now()->year,
        ]);
    }
}

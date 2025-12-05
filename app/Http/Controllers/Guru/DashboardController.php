<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ClassModel;
use App\Models\Student;
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
            ->get();

        // Collect all students from teacher's classes
        $students = [];
        $studentJournals = [];

        foreach ($teacherClasses as $class) {
            foreach ($class->students as $student) {
                $studentUser = $student->user;
                if ($studentUser) {
                    $studentData = [
                        'id' => $studentUser->id,
                        'name' => strtoupper($studentUser->name),
                        'class' => $class->name,
                        'religion' => $student->religion ?? 'ISLAM',
                        'gender' => $student->gender ?? 'L',
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

        return Inertia::render('guru/dashboard', [
            'students' => $students,
            'studentJournals' => $studentJournals,
        ]);
    }

    /**
     * Display student activities for viewing.
     */
    public function showStudentActivities(int $studentId): Response
    {
        $student = User::where('role', User::ROLE_SISWA)
            ->findOrFail($studentId);

        // TODO: Get actual activities from database
        // For now, return mock data
        $activities = [
            ['id' => 1, 'title' => 'Bangun Pagi', 'icon' => '☀️', 'color' => 'bg-orange-100', 'completed' => true],
            ['id' => 2, 'title' => 'Berbakti', 'icon' => '🙏', 'color' => 'bg-blue-100', 'completed' => true],
            ['id' => 3, 'title' => 'Berolahraga', 'icon' => '⚽', 'color' => 'bg-green-100', 'completed' => true],
            ['id' => 4, 'title' => 'Gemar Belajar', 'icon' => '📚', 'color' => 'bg-yellow-100', 'completed' => false],
            ['id' => 5, 'title' => 'Makan Makanan Sehat dan Bergizi', 'icon' => '🍎', 'color' => 'bg-pink-100', 'completed' => true],
            ['id' => 6, 'title' => 'Bermasyarakat', 'icon' => '👨‍👩‍👧‍👦', 'color' => 'bg-purple-100', 'completed' => false],
        ];

        return Inertia::render('guru/student-activities', [
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
                'religion' => 'ISLAM', // TODO: Add religion field
                'gender' => 'L', // TODO: Add gender field
                'progress' => 78,
            ],
            'activities' => $activities,
        ]);
    }

    /**
     * Display student activity detail page for input.
     */
    public function showStudentActivityDetail(int $studentId, int $activityId): Response
    {
        $student = User::where('role', User::ROLE_SISWA)
            ->findOrFail($studentId);

        // Mock data for now - TODO: Get from database
        $activities = [
            1 => ['title' => 'Bangun Pagi', 'icon' => '☀️', 'color' => 'bg-orange-100'],
            2 => ['title' => 'Berbakti', 'icon' => '🙏', 'color' => 'bg-blue-100'],
            3 => ['title' => 'Berolahraga', 'icon' => '⚽', 'color' => 'bg-green-100'],
            4 => ['title' => 'Gemar Belajar', 'icon' => '📚', 'color' => 'bg-yellow-100'],
            5 => ['title' => 'Makan Makanan Sehat dan Bergizi', 'icon' => '🍎', 'color' => 'bg-pink-100'],
            6 => ['title' => 'Bermasyarakat', 'icon' => '👨‍👩‍👧‍👦', 'color' => 'bg-purple-100'],
            7 => ['title' => 'Tidur Cepat', 'icon' => '🌙', 'color' => 'bg-indigo-100'],
        ];

        $activityData = $activities[$activityId] ?? $activities[1];

        // Generate mock tasks for the month
        $tasks = [];
        for ($i = 1; $i <= 10; $i++) {
            $tasks[] = [
                'id' => $i,
                'tanggal' => $i,
                'waktu' => 'Masukan Jawaban',
                'jawaban' => '',
                'approval_orangtua' => false,
                'bukti_foto' => null,
            ];
        }

        return Inertia::render('guru/student-activity-detail', [
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
            ],
            'activity' => [
                'id' => $activityId,
                'title' => $activityData['title'],
                'icon' => $activityData['icon'],
                'color' => $activityData['color'],
                'month' => 'OKTOBER',
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
        $student = User::where('role', User::ROLE_SISWA)
            ->findOrFail($studentId);

        // TODO: Get actual biodata from database
        // For now, return mock data
        $biodata = [
            'hobbies' => [],
            'aspirations' => [],
            'favorite_foods' => [],
            'disliked_foods' => [],
            'favorite_animals' => [],
            'disliked_items' => [],
        ];

        return Inertia::render('guru/student-biodata', [
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
                'religion' => 'ISLAM', // TODO: Add religion field
                'gender' => 'L', // TODO: Add gender field
                'photo' => null, // TODO: Add photo field
            ],
            'biodata' => $biodata,
        ]);
    }
}

<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\ActivitySubmission;
use App\Models\ActivityDetail;
use App\Models\Student;
use App\Models\BangunPagiDetail;
use App\Models\BerolahragaDetail;
use App\Models\BeribadahDetail;
use App\Models\GemarBelajarDetail;
use App\Models\MakanSehatDetail;
use App\Models\BermasyarakatDetail;
use App\Models\TidurCepatDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the siswa dashboard.
     */
    public function index(): Response
    {
        $activities = Activity::orderBy('order')->get();

        return Inertia::render('siswa/dashboard', [
            'activities' => $activities,
        ]);
    }

    /**
     * Display the activity detail page.
     * Route to specific activity detail page based on activity title.
     */
    public function show(Activity $activity): Response
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        $title = strtolower($activity->title);

        // Determine which specific detail page to render
        if (str_contains($title, 'berbakti') || str_contains($title, 'beribadah')) {
            // "Berbakti" in database is actually "Beribadah" with muslim/non-muslim variants
            if ($user->religion === 'muslim') {
                return $this->beribadahMuslimDetail($activity);
            } else {
                return $this->beribadahNonmuslimDetail($activity);
            }
        } elseif (str_contains($title, 'bangun pagi')) {
            return $this->bangunPagiDetail($activity);
        } elseif (str_contains($title, 'berolahraga')) {
            return $this->berolahragaDetail($activity);
        } elseif (str_contains($title, 'gemar belajar')) {
            return $this->gemarBelajarDetail($activity);
        } elseif (str_contains($title, 'makan') && str_contains($title, 'sehat')) {
            return $this->makanSehatDetail($activity);
        } elseif (str_contains($title, 'bermasyarakat')) {
            return $this->bermasyarakatDetail($activity);
        } elseif (str_contains($title, 'tidur cepat')) {
            return $this->tidurCepatDetail($activity);
        }

        // Fallback if no specific page matches
        $nextActivity = Activity::where('order', '>', $activity->order)
            ->orderBy('order', 'asc')
            ->first();

        $previousActivity = Activity::where('order', '<', $activity->order)
            ->orderBy('order', 'desc')
            ->first();

        return Inertia::render('siswa/activities/detail/bangun-pagi-detail', [
            'activity' => $activity,
            'nextActivity' => $nextActivity,
            'previousActivity' => $previousActivity,
        ]);
    }

    /**
     * Display the activity history page.
     */
    public function history(Activity $activity): Response
    {
        return Inertia::render('siswa/activity-history', [
            'activity' => $activity,
        ]);
    }

    /**
     * Display the biodata page.
     */
    public function biodata(): Response
    {
        return Inertia::render('siswa/profile/biodata');
    }

    /**
     * Display the biodata edit page.
     */
    public function biodataEdit(): Response
    {
        return Inertia::render('siswa/profile/biodata-edit');
    }

    /**
     * Display the lagu page.
     */
    public function lagu(): Response
    {
        return Inertia::render('siswa/lagu');
    }

    /**
     * Display the kegiatan harian page.
     */
    public function kegiatanHarian(): Response
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        
        // Get student data
        $student = Student::where('user_id', $user->id)->first();
        
        // Get all activities
        $activities = Activity::orderBy('order')->get();
        
        // Get current month submissions for the student
        if ($student) {
            $submissions = ActivitySubmission::where('student_id', $student->id)
                ->whereYear('date', now()->year)
                ->whereMonth('date', now()->month)
                ->with(['activity'])
                ->get()
                ->groupBy('activity_id');
        } else {
            $submissions = collect();
        }
        
        return Inertia::render('siswa/kegiatan-harian', [
            'activities' => $activities,
            'submissions' => $submissions,
        ]);
    }

    /**
     * Display the beribadah history page.
     * "Berbakti" in database is actually "Beribadah" with muslim/non-muslim variants
     */
    public function berbaktiHistory(): Response
    {
        $activity = Activity::where('title', 'LIKE', '%Berbakti%')->firstOrFail();

        /** @var \App\Models\User $user */
        $user = auth()->user();

        // Determine which component to render based on user's religion
        if ($user->religion === 'muslim') {
            return Inertia::render('siswa/activities/history/beribadah-muslim-history', [
                'activity' => $activity,
            ]);
        } else {
            return Inertia::render('siswa/activities/history/beribadah-nonmuslim-history', [
                'activity' => $activity,
            ]);
        }
    }

    /**
     * Display the beribadah history page.
     */
    public function beribadahHistory(Activity $activity): Response
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        $student = Student::where('user_id', $user->id)->firstOrFail();

        // Get all submissions for this activity
        $submissions = ActivitySubmission::with('beribadahDetail')
            ->where('student_id', $student->id)
            ->where('activity_id', $activity->id)
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($submission) use ($user) {
                // Format the details from beribadah_details table
                $details = [];
                if ($submission->beribadahDetail) {
                    $detail = $submission->beribadahDetail;
                    
                    if ($user->religion === 'muslim') {
                        $details = [
                            'subuh' => ['label' => 'Subuh', 'is_checked' => $detail->subuh],
                            'dzuhur' => ['label' => 'Dzuhur', 'is_checked' => $detail->dzuhur],
                            'ashar' => ['label' => 'Ashar', 'is_checked' => $detail->ashar],
                            'maghrib' => ['label' => 'Maghrib', 'is_checked' => $detail->maghrib],
                            'isya' => ['label' => 'Isya', 'is_checked' => $detail->isya],
                            'mengaji' => ['label' => 'Mengaji', 'is_checked' => $detail->mengaji],
                            'berdoa' => ['label' => 'Berdoa', 'is_checked' => $detail->berdoa],
                            'bersedekah' => ['label' => 'Bersedekah', 'is_checked' => $detail->bersedekah],
                            'lainnya' => ['label' => 'Lainnya', 'is_checked' => $detail->lainnya],
                        ];
                    } else {
                        $details = [
                            'doa_pagi' => ['label' => 'Doa Pagi', 'is_checked' => $detail->doa_pagi],
                            'baca_firman' => ['label' => 'Baca Firman', 'is_checked' => $detail->baca_firman],
                            'renungan' => ['label' => 'Renungan', 'is_checked' => $detail->renungan],
                            'doa_malam' => ['label' => 'Doa Malam', 'is_checked' => $detail->doa_malam],
                            'ibadah_bersama' => ['label' => 'Ibadah Bersama', 'is_checked' => $detail->ibadah_bersama],
                        ];
                    }
                }

                return [
                    'id' => $submission->id,
                    'date' => $submission->date->format('Y-m-d'),
                    'time' => $submission->time,
                    'photo' => $submission->photo,
                    'status' => $submission->status,
                    'approved_by' => $submission->approved_by,
                    'approved_at' => $submission->approved_at,
                    'details' => $details,
                ];
            });

        // Determine which component to render based on user's religion
        if ($user->religion === 'muslim') {
            return Inertia::render('siswa/activities/history/beribadah-muslim-history', [
                'activity' => $activity,
                'submissions' => $submissions,
            ]);
        } else {
            return Inertia::render('siswa/activities/history/beribadah-nonmuslim-history', [
                'activity' => $activity,
                'submissions' => $submissions,
            ]);
        }
    }

    /**
     * Display the bangun pagi history page.
     */
    public function bangunPagiHistory(): Response
    {
        $activity = Activity::where('title', 'LIKE', '%Bangun Pagi%')->firstOrFail();

        /** @var \App\Models\User $user */
        $user = auth()->user();
        $student = Student::where('user_id', $user->id)->firstOrFail();

        // Get all submissions for this activity
        $submissions = ActivitySubmission::with('bangunPagiDetail')
            ->where('student_id', $student->id)
            ->where('activity_id', $activity->id)
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($submission) {
                // Format the details from bangun_pagi_details table
                // Map new table fields back to old field names for frontend compatibility
                $details = [];
                if ($submission->bangunPagiDetail) {
                    $detail = $submission->bangunPagiDetail;
                    $details = [
                        'membereskan_tempat_tidur' => [
                            'label' => 'Membereskan Tempat Tidur',
                            'is_checked' => $detail->tidy_bed,
                        ],
                        'mandi' => [
                            'label' => 'Mandi',
                            'is_checked' => $detail->tidy_room,
                        ],
                        'berpakaian_rapi' => [
                            'label' => 'Berpakaian Rapi',
                            'is_checked' => $detail->open_window,
                        ],
                        'sarapan' => [
                            'label' => 'Sarapan',
                            'is_checked' => $detail->morning_prayer,
                        ],
                    ];
                }

                return [
                    'id' => $submission->id,
                    'date' => $submission->date->format('Y-m-d'),
                    'time' => $submission->time,
                    'photo' => $submission->photo,
                    'status' => $submission->status,
                    'approved_by' => $submission->approved_by,
                    'approved_at' => $submission->approved_at,
                    'details' => $details,
                ];
            });

        return Inertia::render('siswa/activities/history/bangun-pagi-history', [
            'activity' => $activity,
            'submissions' => $submissions,
        ]);
    }

    /**
     * Display the berolahraga history page.
     */
    public function berolahragaHistory(): Response
    {
        $activity = Activity::where('title', 'LIKE', '%Berolahraga%')->firstOrFail();

        /** @var \App\Models\User $user */
        $user = auth()->user();
        $student = Student::where('user_id', $user->id)->firstOrFail();

        // Get all submissions for this activity
        $submissions = ActivitySubmission::with('berolahragaDetail')
            ->where('student_id', $student->id)
            ->where('activity_id', $activity->id)
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($submission) {
                // Format the details from berolahraga_details table
                $details = [];
                if ($submission->berolahragaDetail) {
                    $detail = $submission->berolahragaDetail;
                    $details = [
                        'berolahraga' => [
                            'label' => 'Berolahraga',
                            'is_checked' => !empty($detail->exercise_type),
                        ],
                        'waktu_berolahraga' => [
                            'label' => 'Waktu Berolahraga',
                            'value' => $detail->exercise_duration ? $detail->exercise_duration . ' menit' : null,
                        ],
                    ];
                }

                return [
                    'id' => $submission->id,
                    'date' => $submission->date->format('Y-m-d'),
                    'time' => $submission->time,
                    'photo' => $submission->photo,
                    'status' => $submission->status,
                    'approved_by' => $submission->approved_by,
                    'approved_at' => $submission->approved_at,
                    'details' => $details,
                ];
            });

        return Inertia::render('siswa/activities/history/berolahraga-history', [
            'activity' => $activity,
            'submissions' => $submissions,
        ]);
    }

    /**
     * Display the gemar belajar history page.
     */
    public function gemarBelajarHistory(): Response
    {
        $activity = Activity::where('title', 'LIKE', '%Gemar Belajar%')->firstOrFail();

        /** @var \App\Models\User $user */
        $user = auth()->user();
        $student = Student::where('user_id', $user->id)->firstOrFail();

        // Get all submissions for this activity
        $submissions = ActivitySubmission::with('gemarBelajarDetail')
            ->where('student_id', $student->id)
            ->where('activity_id', $activity->id)
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($submission) {
                // Format the details from gemar_belajar_details table
                $details = [];
                if ($submission->gemarBelajarDetail) {
                    $detail = $submission->gemarBelajarDetail;
                    $studyType = $detail->study_type ?? '';
                    
                    $details = [
                        'gemar_belajar' => [
                            'label' => 'Gemar Belajar',
                            'is_checked' => str_contains($studyType, 'Gemar Belajar'),
                        ],
                        'ekstrakurikuler' => [
                            'label' => 'Ekstrakurikuler',
                            'is_checked' => str_contains($studyType, 'Ekstrakurikuler'),
                        ],
                        'bimbingan_belajar' => [
                            'label' => 'Bimbingan Belajar',
                            'is_checked' => str_contains($studyType, 'Bimbingan Belajar'),
                        ],
                        'mengerjakan_tugas' => [
                            'label' => 'Mengerjakan Tugas',
                            'is_checked' => str_contains($studyType, 'Mengerjakan Tugas'),
                        ],
                        'lainnya' => [
                            'label' => 'Lainnya',
                            'is_checked' => str_contains($studyType, 'Lainnya'),
                        ],
                    ];
                }

                return [
                    'id' => $submission->id,
                    'date' => $submission->date->format('Y-m-d'),
                    'time' => $submission->time,
                    'photo' => $submission->photo,
                    'status' => $submission->status,
                    'approved_by' => $submission->approved_by,
                    'approved_at' => $submission->approved_at,
                    'details' => $details,
                ];
            });

        return Inertia::render('siswa/activities/history/gemar-belajar-history', [
            'activity' => $activity,
            'submissions' => $submissions,
        ]);
    }

    /**
     * Display the makan sehat history page.
     */
    public function makanSehatHistory(): Response
    {
        $activity = Activity::where('title', 'LIKE', '%Makan%')->firstOrFail();

        /** @var \App\Models\User $user */
        $user = auth()->user();
        $student = Student::where('user_id', $user->id)->firstOrFail();

        // Get all submissions for this activity
        $submissions = ActivitySubmission::with('makanSehatDetail')
            ->where('student_id', $student->id)
            ->where('activity_id', $activity->id)
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($submission) {
                // Format the details from makan_sehat_details table
                $details = [];
                if ($submission->makanSehatDetail) {
                    $detail = $submission->makanSehatDetail;
                    // Send the actual food names selected
                    $details = [
                        'karbohidrat' => $detail->karbohidrat,
                        'protein' => $detail->protein,
                        'sayur' => $detail->sayur,
                        'buah' => $detail->buah,
                    ];
                }

                return [
                    'id' => $submission->id,
                    'date' => $submission->date->format('Y-m-d'),
                    'time' => $submission->time,
                    'photo' => $submission->photo,
                    'status' => $submission->status,
                    'approved_by' => $submission->approved_by,
                    'approved_at' => $submission->approved_at,
                    'details' => $details,
                ];
            });

        return Inertia::render('siswa/activities/history/makan-sehat-history', [
            'activity' => $activity,
            'submissions' => $submissions,
        ]);
    }

    /**
     * Display the bermasyarakat history page.
     */
    public function bermasyarakatHistory(): Response
    {
        $activity = Activity::where('title', 'LIKE', '%Bermasyarakat%')->firstOrFail();

        /** @var \App\Models\User $user */
        $user = auth()->user();
        $student = Student::where('user_id', $user->id)->firstOrFail();

        // Get all submissions for this activity
        $submissions = ActivitySubmission::with('bermasyarakatDetail')
            ->where('student_id', $student->id)
            ->where('activity_id', $activity->id)
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($submission) {
                // Format the details from bermasyarakat_details table
                $details = [];
                if ($submission->bermasyarakatDetail) {
                    $detail = $submission->bermasyarakatDetail;
                    // Format according to what frontend expects
                    $details = [
                        'tarka' => ['label' => 'Tarka', 'is_checked' => $detail->tarka],
                        'kerja_bakti' => ['label' => 'Kerja Bakti', 'is_checked' => $detail->kerja_bakti],
                        'gotong_royong' => ['label' => 'Gotong Royong', 'is_checked' => $detail->gotong_royong],
                        'lainnya' => ['label' => 'Lainnya', 'is_checked' => $detail->lainnya],
                    ];
                }

                return [
                    'id' => $submission->id,
                    'date' => $submission->date->format('Y-m-d'),
                    'time' => $submission->time,
                    'photo' => $submission->photo,
                    'status' => $submission->status,
                    'approved_by' => $submission->approved_by,
                    'approved_at' => $submission->approved_at,
                    'details' => $details,
                ];
            });

        return Inertia::render('siswa/activities/history/bermasyarakat-history', [
            'activity' => $activity,
            'submissions' => $submissions,
        ]);
    }

    /**
     * Display the tidur cepat history page.
     */
    public function tidurCepatHistory(): Response
    {
        $activity = Activity::where('title', 'LIKE', '%Tidur%')->firstOrFail();

        /** @var \App\Models\User $user */
        $user = auth()->user();
        $student = Student::where('user_id', $user->id)->firstOrFail();

        // Get all submissions for this activity
        $submissions = ActivitySubmission::with('tidurCepatDetail')
            ->where('student_id', $student->id)
            ->where('activity_id', $activity->id)
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($submission) {
                // Format the details from tidur_cepat_details table
                $details = [];
                if ($submission->tidurCepatDetail) {
                    $detail = $submission->tidurCepatDetail;
                    $sleepTime = $detail->sleep_time ? \Carbon\Carbon::parse($detail->sleep_time)->format('H:i') : '';
                    // Format according to what frontend expects
                    $details = [
                        'waktu_tidur' => ['label' => 'Waktu Tidur', 'is_checked' => true, 'value' => $sleepTime],
                    ];
                }

                return [
                    'id' => $submission->id,
                    'date' => $submission->date->format('Y-m-d'),
                    'time' => $submission->time,
                    'photo' => $submission->photo,
                    'status' => $submission->status,
                    'approved_by' => $submission->approved_by,
                    'approved_at' => $submission->approved_at,
                    'details' => $details,
                ];
            });

        return Inertia::render('siswa/activities/history/tidur-cepat-history', [
            'activity' => $activity,
            'submissions' => $submissions,
        ]);
    }

    // ==================== Activity Detail Methods ====================

    /**
     * Display the beribadah muslim detail page.
     */
    public function beribadahMuslimDetail(Activity $activity): Response
    {
        $nextActivity = Activity::where('order', '>', $activity->order)->orderBy('order', 'asc')->first();
        $previousActivity = Activity::where('order', '<', $activity->order)->orderBy('order', 'desc')->first();

        /** @var \App\Models\User $user */
        $user = auth()->user();
        $student = Student::where('user_id', $user->id)->firstOrFail();

        // Support test_date parameter for testing (only in non-production)
        $today = request('test_date') && config('app.env') !== 'production' 
            ? request('test_date') 
            : now()->format('Y-m-d');
        
        // Get today's submission if exists
        $todaySubmission = ActivitySubmission::with('beribadahDetail')
            ->where('student_id', $student->id)
            ->where('activity_id', $activity->id)
            ->where('date', $today)
            ->first();

        // Format submission data using new beribadah_details table
        $submissionData = null;
        if ($todaySubmission && $todaySubmission->beribadahDetail) {
            $detail = $todaySubmission->beribadahDetail;
            $details = [
                'subuh' => ['label' => 'Subuh', 'is_checked' => $detail->subuh],
                'dzuhur' => ['label' => 'Dzuhur', 'is_checked' => $detail->dzuhur],
                'ashar' => ['label' => 'Ashar', 'is_checked' => $detail->ashar],
                'maghrib' => ['label' => 'Maghrib', 'is_checked' => $detail->maghrib],
                'isya' => ['label' => 'Isya', 'is_checked' => $detail->isya],
                'mengaji' => ['label' => 'Mengaji', 'is_checked' => $detail->mengaji],
                'berdoa' => ['label' => 'Berdoa', 'is_checked' => $detail->berdoa],
                'bersedekah' => ['label' => 'Bersedekah', 'is_checked' => $detail->bersedekah],
                'lainnya' => ['label' => 'Lainnya', 'is_checked' => $detail->lainnya],
            ];

            $submissionData = [
                'id' => $todaySubmission->id,
                'date' => $todaySubmission->date->format('Y-m-d'),
                'time' => $todaySubmission->time,
                'photo' => $todaySubmission->photo,
                'status' => $todaySubmission->status,
                'details' => $details,
            ];
        }

        // Count photos for this month FOR THIS ACTIVITY
        $photoCountThisMonth = ActivitySubmission::where('student_id', $student->id)
            ->where('activity_id', $activity->id)
            ->whereYear('date', now()->year)
            ->whereMonth('date', now()->month)
            ->whereNotNull('photo')
            ->where('photo', '!=', '')
            ->count();

        // Check if photo was uploaded today
        $photoUploadedToday = $todaySubmission && $todaySubmission->photo;

        return Inertia::render('siswa/activities/detail/beribadah-muslim-detail', [
            'activity' => $activity,
            'nextActivity' => $nextActivity,
            'previousActivity' => $previousActivity,
            'todaySubmission' => $submissionData,
            'photoCountThisMonth' => $photoCountThisMonth,
            'photoUploadedToday' => $photoUploadedToday,
            'currentDate' => $today,
        ]);
    }

    /**
     * Display the beribadah nonmuslim detail page.
     */
    public function beribadahNonmuslimDetail(Activity $activity): Response
    {
        $nextActivity = Activity::where('order', '>', $activity->order)->orderBy('order', 'asc')->first();
        $previousActivity = Activity::where('order', '<', $activity->order)->orderBy('order', 'desc')->first();

        /** @var \App\Models\User $user */
        $user = auth()->user();
        $student = Student::where('user_id', $user->id)->firstOrFail();

        // Support test_date parameter for testing (only in non-production)
        $today = request('test_date') && config('app.env') !== 'production' 
            ? request('test_date') 
            : now()->format('Y-m-d');
        
        // Get today's submission if exists
        $todaySubmission = ActivitySubmission::with('beribadahDetail')
            ->where('student_id', $student->id)
            ->where('activity_id', $activity->id)
            ->where('date', $today)
            ->first();

        // Format submission data using new beribadah_details table
        $submissionData = null;
        if ($todaySubmission && $todaySubmission->beribadahDetail) {
            $detail = $todaySubmission->beribadahDetail;
            $details = [
                'doa_pagi' => ['label' => 'Doa Pagi', 'is_checked' => $detail->doa_pagi],
                'baca_firman' => ['label' => 'Baca Firman', 'is_checked' => $detail->baca_firman],
                'renungan' => ['label' => 'Renungan', 'is_checked' => $detail->renungan],
                'doa_malam' => ['label' => 'Doa Malam', 'is_checked' => $detail->doa_malam],
                'ibadah_bersama' => ['label' => 'Ibadah Bersama', 'is_checked' => $detail->ibadah_bersama],
            ];

            $submissionData = [
                'id' => $todaySubmission->id,
                'date' => $todaySubmission->date->format('Y-m-d'),
                'time' => $todaySubmission->time,
                'photo' => $todaySubmission->photo,
                'status' => $todaySubmission->status,
                'details' => $details,
            ];
        }

        // Count photos for this month FOR THIS ACTIVITY
        $photoCountThisMonth = ActivitySubmission::where('student_id', $student->id)
            ->where('activity_id', $activity->id)
            ->whereYear('date', now()->year)
            ->whereMonth('date', now()->month)
            ->whereNotNull('photo')
            ->where('photo', '!=', '')
            ->count();

        // Check if photo was uploaded today
        $photoUploadedToday = $todaySubmission && $todaySubmission->photo;

        return Inertia::render('siswa/activities/detail/beribadah-nonmuslim-detail', [
            'activity' => $activity,
            'nextActivity' => $nextActivity,
            'previousActivity' => $previousActivity,
            'todaySubmission' => $submissionData,
            'photoCountThisMonth' => $photoCountThisMonth,
            'photoUploadedToday' => $photoUploadedToday,
            'currentDate' => $today,
        ]);
    }

    /**
     * Display the bangun pagi detail page.
     */
    public function bangunPagiDetail(Activity $activity): Response
    {
        $nextActivity = Activity::where('order', '>', $activity->order)->orderBy('order', 'asc')->first();
        $previousActivity = Activity::where('order', '<', $activity->order)->orderBy('order', 'desc')->first();

        /** @var \App\Models\User $user */
        $user = auth()->user();
        $student = Student::where('user_id', $user->id)->firstOrFail();

        // Support test_date parameter for testing (only in non-production)
        $today = request('test_date') && config('app.env') !== 'production' 
            ? request('test_date') 
            : now()->format('Y-m-d');

        // Get current month's photo uploads FOR THIS ACTIVITY
        $currentMonth = now()->month;
        $currentYear = now()->year;
        
        $photoCountThisMonth = ActivitySubmission::where('student_id', $student->id)
            ->where('activity_id', $activity->id)
            ->whereYear('date', $currentYear)
            ->whereMonth('date', $currentMonth)
            ->whereNotNull('photo')
            ->where('photo', '!=', '')
            ->count();

        // Check if photo was uploaded today FOR THIS ACTIVITY
        $todaySubmission = ActivitySubmission::where('student_id', $student->id)
            ->where('activity_id', $activity->id)
            ->where('date', $today)
            ->whereNotNull('photo')
            ->where('photo', '!=', '')
            ->first();
        $photoUploadedToday = $todaySubmission !== null;

        return Inertia::render('siswa/activities/detail/bangun-pagi-detail', [
            'activity' => $activity,
            'nextActivity' => $nextActivity,
            'previousActivity' => $previousActivity,
            'photoCountThisMonth' => $photoCountThisMonth,
            'photoUploadedToday' => $photoUploadedToday,
            'currentDate' => $today,
        ]);
    }

    /**
     * Display the berolahraga detail page.
     */
    public function berolahragaDetail(Activity $activity): Response
    {
        $nextActivity = Activity::where('order', '>', $activity->order)->orderBy('order', 'asc')->first();
        $previousActivity = Activity::where('order', '<', $activity->order)->orderBy('order', 'desc')->first();

        /** @var \App\Models\User $user */
        $user = auth()->user();
        $student = Student::where('user_id', $user->id)->firstOrFail();

        // Support test_date parameter for testing (only in non-production)
        $today = request('test_date') && config('app.env') !== 'production' 
            ? request('test_date') 
            : now()->format('Y-m-d');
        
        // Get today's submission if exists
        $todaySubmission = ActivitySubmission::with('berolahragaDetail')
            ->where('student_id', $student->id)
            ->where('activity_id', $activity->id)
            ->where('date', $today)
            ->first();

        // Format submission data
        $submissionData = null;
        if ($todaySubmission && $todaySubmission->berolahragaDetail) {
            $detail = $todaySubmission->berolahragaDetail;
            $details = [
                'waktu_berolahraga' => ['label' => 'Waktu Berolahraga', 'is_checked' => true, 'value' => $detail->waktu_berolahraga],
            ];

            $submissionData = [
                'id' => $todaySubmission->id,
                'date' => $todaySubmission->date->format('Y-m-d'),
                'time' => $todaySubmission->time,
                'photo' => $todaySubmission->photo,
                'status' => $todaySubmission->status,
                'details' => $details,
            ];
        }

        $currentMonth = now()->month;
        $currentYear = now()->year;
        $photoCountThisMonth = ActivitySubmission::where('student_id', $student->id)
            ->where('activity_id', $activity->id)
            ->whereYear('date', $currentYear)
            ->whereMonth('date', $currentMonth)
            ->whereNotNull('photo')
            ->where('photo', '!=', '')
            ->count();

        // Check if photo was uploaded today
        $photoUploadedToday = $todaySubmission && $todaySubmission->photo;

        return Inertia::render('siswa/activities/detail/berolahraga-detail', [
            'activity' => $activity,
            'nextActivity' => $nextActivity,
            'previousActivity' => $previousActivity,
            'photoCountThisMonth' => $photoCountThisMonth,
            'photoUploadedToday' => $photoUploadedToday,
            'todaySubmission' => $submissionData,
            'currentDate' => $today,
        ]);
    }

    /**
     * Display the gemar belajar detail page.
     */
    public function gemarBelajarDetail(Activity $activity): Response
    {
        $nextActivity = Activity::where('order', '>', $activity->order)->orderBy('order', 'asc')->first();
        $previousActivity = Activity::where('order', '<', $activity->order)->orderBy('order', 'desc')->first();

        /** @var \App\Models\User $user */
        $user = auth()->user();
        $student = Student::where('user_id', $user->id)->firstOrFail();

        // Support test_date parameter for testing (only in non-production)
        $today = request('test_date') && config('app.env') !== 'production' 
            ? request('test_date') 
            : now()->format('Y-m-d');
        
        // Get today's submission if exists
        $todaySubmission = ActivitySubmission::with('gemarBelajarDetail')
            ->where('student_id', $student->id)
            ->where('activity_id', $activity->id)
            ->where('date', $today)
            ->first();

        // Format submission data
        $submissionData = null;
        if ($todaySubmission && $todaySubmission->gemarBelajarDetail) {
            $detail = $todaySubmission->gemarBelajarDetail;
            $studyType = $detail->study_type ?? '';
            
            $details = [
                'gemar_belajar' => ['label' => 'Gemar Belajar', 'is_checked' => str_contains($studyType, 'Gemar Belajar')],
                'ekstrakurikuler' => ['label' => 'Ekstrakurikuler', 'is_checked' => str_contains($studyType, 'Ekstrakurikuler')],
                'bimbingan_belajar' => ['label' => 'Bimbingan Belajar', 'is_checked' => str_contains($studyType, 'Bimbingan Belajar')],
                'mengerjakan_tugas' => ['label' => 'Mengerjakan Tugas', 'is_checked' => str_contains($studyType, 'Mengerjakan Tugas')],
                'lainnya' => ['label' => 'Lainnya', 'is_checked' => str_contains($studyType, 'Lainnya')],
            ];

            $submissionData = [
                'id' => $todaySubmission->id,
                'date' => $todaySubmission->date->format('Y-m-d'),
                'time' => $todaySubmission->time,
                'photo' => $todaySubmission->photo,
                'status' => $todaySubmission->status,
                'details' => $details,
            ];
        }

        $currentMonth = now()->month;
        $currentYear = now()->year;
        $photoCountThisMonth = ActivitySubmission::where('student_id', $student->id)
            ->where('activity_id', $activity->id)
            ->whereYear('date', $currentYear)
            ->whereMonth('date', $currentMonth)
            ->whereNotNull('photo')
            ->where('photo', '!=', '')
            ->count();

        // Check if photo was uploaded today
        $photoUploadedToday = $todaySubmission && $todaySubmission->photo;

        return Inertia::render('siswa/activities/detail/gemar-belajar-detail', [
            'activity' => $activity,
            'nextActivity' => $nextActivity,
            'previousActivity' => $previousActivity,
            'photoCountThisMonth' => $photoCountThisMonth,
            'photoUploadedToday' => $photoUploadedToday,
            'todaySubmission' => $submissionData,
            'currentDate' => $today,
        ]);
    }

    /**
     * Display the makan sehat detail page.
     */
    public function makanSehatDetail(Activity $activity): Response
    {
        $nextActivity = Activity::where('order', '>', $activity->order)->orderBy('order', 'asc')->first();
        $previousActivity = Activity::where('order', '<', $activity->order)->orderBy('order', 'desc')->first();

        /** @var \App\Models\User $user */
        $user = auth()->user();
        $student = Student::where('user_id', $user->id)->firstOrFail();

        // Support test_date parameter for testing (only in non-production)
        $today = request('test_date') && config('app.env') !== 'production' 
            ? request('test_date') 
            : now()->format('Y-m-d');
        
        // Get today's submission if exists
        $todaySubmission = ActivitySubmission::with('makanSehatDetail')
            ->where('student_id', $student->id)
            ->where('activity_id', $activity->id)
            ->where('date', $today)
            ->first();

        // Format submission data
        $submissionData = null;
        if ($todaySubmission && $todaySubmission->makanSehatDetail) {
            $detail = $todaySubmission->makanSehatDetail;
            $details = [
                'karbohidrat' => ['label' => 'Karbohidrat', 'is_checked' => true, 'value' => $detail->karbohidrat],
                'protein' => ['label' => 'Protein', 'is_checked' => true, 'value' => $detail->protein],
                'sayur' => ['label' => 'Sayur', 'is_checked' => true, 'value' => $detail->sayur],
                'buah' => ['label' => 'Buah', 'is_checked' => true, 'value' => $detail->buah],
            ];

            $submissionData = [
                'id' => $todaySubmission->id,
                'date' => $todaySubmission->date->format('Y-m-d'),
                'time' => $todaySubmission->time,
                'photo' => $todaySubmission->photo,
                'status' => $todaySubmission->status,
                'details' => $details,
            ];
        }

        $currentMonth = now()->month;
        $currentYear = now()->year;
        $photoCountThisMonth = ActivitySubmission::where('student_id', $student->id)
            ->where('activity_id', $activity->id)
            ->whereYear('date', $currentYear)
            ->whereMonth('date', $currentMonth)
            ->whereNotNull('photo')
            ->where('photo', '!=', '')
            ->count();

        // Check if photo was uploaded today
        $photoUploadedToday = $todaySubmission && $todaySubmission->photo;

        return Inertia::render('siswa/activities/detail/makan-sehat-detail', [
            'activity' => $activity,
            'nextActivity' => $nextActivity,
            'previousActivity' => $previousActivity,
            'photoCountThisMonth' => $photoCountThisMonth,
            'photoUploadedToday' => $photoUploadedToday,
            'todaySubmission' => $submissionData,
            'currentDate' => $today,
        ]);
    }

    /**
     * Display the bermasyarakat detail page.
     */
    public function bermasyarakatDetail(Activity $activity): Response
    {
        $nextActivity = Activity::where('order', '>', $activity->order)->orderBy('order', 'asc')->first();
        $previousActivity = Activity::where('order', '<', $activity->order)->orderBy('order', 'desc')->first();

        /** @var \App\Models\User $user */
        $user = auth()->user();
        $student = Student::where('user_id', $user->id)->firstOrFail();

        // Support test_date parameter for testing (only in non-production)
        $today = request('test_date') && config('app.env') !== 'production' 
            ? request('test_date') 
            : now()->format('Y-m-d');
        
        // Get today's submission if exists
        $todaySubmission = ActivitySubmission::with('bermasyarakatDetail')
            ->where('student_id', $student->id)
            ->where('activity_id', $activity->id)
            ->where('date', $today)
            ->first();

        // Format submission data
        $submissionData = null;
        if ($todaySubmission && $todaySubmission->bermasyarakatDetail) {
            $detail = $todaySubmission->bermasyarakatDetail;
            $details = [
                'tarka' => ['label' => 'Tarka', 'is_checked' => $detail->tarka],
                'kerja_bakti' => ['label' => 'Kerja Bakti', 'is_checked' => $detail->kerja_bakti],
                'gotong_royong' => ['label' => 'Gotong Royong', 'is_checked' => $detail->gotong_royong],
                'lainnya' => ['label' => 'Lainnya', 'is_checked' => $detail->lainnya],
            ];

            $submissionData = [
                'id' => $todaySubmission->id,
                'date' => $todaySubmission->date->format('Y-m-d'),
                'time' => $todaySubmission->time,
                'photo' => $todaySubmission->photo,
                'status' => $todaySubmission->status,
                'details' => $details,
            ];
        }

        $currentMonth = now()->month;
        $currentYear = now()->year;
        $photoCountThisMonth = ActivitySubmission::where('student_id', $student->id)
            ->where('activity_id', $activity->id)
            ->whereYear('date', $currentYear)
            ->whereMonth('date', $currentMonth)
            ->whereNotNull('photo')
            ->where('photo', '!=', '')
            ->count();

        // Check if photo was uploaded today
        $photoUploadedToday = $todaySubmission && $todaySubmission->photo;

        return Inertia::render('siswa/activities/detail/bermasyarakat-detail', [
            'activity' => $activity,
            'nextActivity' => $nextActivity,
            'previousActivity' => $previousActivity,
            'photoCountThisMonth' => $photoCountThisMonth,
            'photoUploadedToday' => $photoUploadedToday,
            'todaySubmission' => $submissionData,
            'currentDate' => $today,
        ]);
    }

    /**
     * Display the tidur cepat detail page.
     */
    public function tidurCepatDetail(Activity $activity): Response
    {
        $nextActivity = Activity::where('order', '>', $activity->order)->orderBy('order', 'asc')->first();
        $previousActivity = Activity::where('order', '<', $activity->order)->orderBy('order', 'desc')->first();

        /** @var \App\Models\User $user */
        $user = auth()->user();
        $student = Student::where('user_id', $user->id)->firstOrFail();

        // Support test_date parameter for testing (only in non-production)
        $today = request('test_date') && config('app.env') !== 'production' 
            ? request('test_date') 
            : now()->format('Y-m-d');
        
        // Get today's submission if exists
        $todaySubmission = ActivitySubmission::with('tidurCepatDetail')
            ->where('student_id', $student->id)
            ->where('activity_id', $activity->id)
            ->where('date', $today)
            ->first();

        // Format submission data
        $submissionData = null;
        if ($todaySubmission && $todaySubmission->tidurCepatDetail) {
            $detail = $todaySubmission->tidurCepatDetail;
            $sleepTime = $detail->sleep_time ? \Carbon\Carbon::parse($detail->sleep_time)->format('H:i') : '';
            $details = [
                'waktu_tidur' => ['label' => 'Waktu Tidur', 'is_checked' => true, 'value' => $sleepTime],
            ];

            $submissionData = [
                'id' => $todaySubmission->id,
                'date' => $todaySubmission->date->format('Y-m-d'),
                'time' => $todaySubmission->time,
                'photo' => $todaySubmission->photo,
                'status' => $todaySubmission->status,
                'details' => $details,
            ];
        }

        $currentMonth = now()->month;
        $currentYear = now()->year;
        $photoCountThisMonth = ActivitySubmission::where('student_id', $student->id)
            ->where('activity_id', $activity->id)
            ->whereYear('date', $currentYear)
            ->whereMonth('date', $currentMonth)
            ->whereNotNull('photo')
            ->where('photo', '!=', '')
            ->count();

        // Check if photo was uploaded today
        $photoUploadedToday = $todaySubmission && $todaySubmission->photo;

        return Inertia::render('siswa/activities/detail/tidur-cepat-detail', [
            'activity' => $activity,
            'nextActivity' => $nextActivity,
            'previousActivity' => $previousActivity,
            'photoCountThisMonth' => $photoCountThisMonth,
            'photoUploadedToday' => $photoUploadedToday,
            'todaySubmission' => $submissionData,
            'currentDate' => $today,
        ]);
    }

    /**
     * Submit Bangun Pagi activity.
     */
    public function submitBangunPagi(Request $request)
    {
        $validated = $request->validate([
            'activity_id' => 'required|exists:activities,id',
            'date' => 'required|date',
            'time' => 'nullable|date_format:H:i',
            'membereskan_tempat_tidur' => 'boolean',
            'mandi' => 'boolean',
            'berpakaian_rapi' => 'boolean',
            'sarapan' => 'boolean',
            'photo' => 'nullable|image|max:2048',
        ]);

        /** @var \App\Models\User $user */
        $user = auth()->user();
        
        // Get student record
        $student = Student::where('user_id', $user->id)->firstOrFail();

        // Check if user is trying to upload a photo
        if ($request->hasFile('photo')) {
            // Get the month and year from the submitted date
            $submissionDate = \Carbon\Carbon::parse($validated['date']);
            $month = $submissionDate->month;
            $year = $submissionDate->year;

            // Count photos already uploaded this month (across all activities)
            $photoCountThisMonth = ActivitySubmission::where('student_id', $student->id)
                ->whereYear('date', $year)
                ->whereMonth('date', $month)
                ->whereNotNull('photo')
                ->where('photo', '!=', '')
                ->count();

            // Check if this is an update of existing submission with photo
            $existingSubmission = ActivitySubmission::where('student_id', $student->id)
                ->where('activity_id', $validated['activity_id'])
                ->where('date', $validated['date'])
                ->first();

            // If already has 1 photo this month and this is not an update of that same photo
            if ($photoCountThisMonth >= 1 && (!$existingSubmission || !$existingSubmission->photo)) {
                return back()->withErrors(['photo' => 'Anda sudah upload foto untuk bulan ini. Maksimal 1 foto per bulan.']);
            }
        }

        DB::beginTransaction();
        try {
            // Handle photo upload if present
            $photoPath = null;
            if ($request->hasFile('photo')) {
                $photoPath = $request->file('photo')->store('activity-photos', 'public');
            }

            // Create or update submission
            $dataToUpdate = ['status' => 'pending'];
            
            // Only update time if provided
            if ($request->filled('time')) {
                $dataToUpdate['time'] = $request->input('time');
            }
            
            // Only update photo if uploaded
            if ($photoPath) {
                $dataToUpdate['photo'] = $photoPath;
            }
            
            $submission = ActivitySubmission::updateOrCreate(
                [
                    'student_id' => $student->id,
                    'activity_id' => $validated['activity_id'],
                    'date' => $validated['date'],
                ],
                $dataToUpdate
            );

            // Store activity details (checkboxes)
            $details = [
                [
                    'field_type' => 'checkbox',
                    'field_name' => 'membereskan_tempat_tidur',
                    'field_label' => 'Membereskan Tempat Tidur',
                    'is_checked' => $validated['membereskan_tempat_tidur'] ?? false,
                ],
                [
                    'field_type' => 'checkbox',
                    'field_name' => 'mandi',
                    'field_label' => 'Mandi',
                    'is_checked' => $validated['mandi'] ?? false,
                ],
                [
                    'field_type' => 'checkbox',
                    'field_name' => 'berpakaian_rapi',
                    'field_label' => 'Berpakaian Rapi',
                    'is_checked' => $validated['berpakaian_rapi'] ?? false,
                ],
                [
                    'field_type' => 'checkbox',
                    'field_name' => 'sarapan',
                    'field_label' => 'Sarapan',
                    'is_checked' => $validated['sarapan'] ?? false,
                ],
            ];

            // Delete existing details for this submission
            ActivityDetail::where('submission_id', $submission->id)->delete();

            // Insert new details
            foreach ($details as $detail) {
                ActivityDetail::create([
                    'submission_id' => $submission->id,
                    'field_type' => $detail['field_type'],
                    'field_name' => $detail['field_name'],
                    'field_label' => $detail['field_label'],
                    'is_checked' => $detail['is_checked'],
                ]);
            }

            // Save to bangun_pagi_details table (new structure)
            $this->saveBangunPagiDetails($submission->id, $request);

            DB::commit();

            return back()->with('success', 'Kegiatan berhasil disimpan!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menyimpan kegiatan: ' . $e->getMessage()]);
        }
    }

    /**
     * Submit activity data (universal for all activities)
     */
    public function submitActivity(Request $request)
    {
        // Basic validation
        $validated = $request->validate([
            'activity_id' => 'required|exists:activities,id',
            'date' => 'required|date',
            'photo' => 'nullable|image|max:2048',
        ]);

        /** @var \App\Models\User $user */
        $user = auth()->user();
        
        // Get student record
        $student = Student::where('user_id', $user->id)->firstOrFail();

        // Check if user is trying to upload a photo
        if ($request->hasFile('photo')) {
            // Get the month and year from the submitted date
            $submissionDate = \Carbon\Carbon::parse($validated['date']);
            $month = $submissionDate->month;
            $year = $submissionDate->year;

            // Count photos already uploaded this month FOR THIS ACTIVITY
            $photoCountThisMonth = ActivitySubmission::where('student_id', $student->id)
                ->where('activity_id', $validated['activity_id'])
                ->whereYear('date', $year)
                ->whereMonth('date', $month)
                ->whereNotNull('photo')
                ->where('photo', '!=', '')
                ->count();

            // Check if this is an update of existing submission with photo
            $existingSubmission = ActivitySubmission::where('student_id', $student->id)
                ->where('activity_id', $validated['activity_id'])
                ->where('date', $validated['date'])
                ->first();

            // If already has 1 photo this month and this is not an update of that same photo
            if ($photoCountThisMonth >= 1 && (!$existingSubmission || !$existingSubmission->photo)) {
                return back()->withErrors(['photo' => 'Anda sudah upload foto untuk bulan ini. Maksimal 1 foto per bulan.']);
            }
        }

        DB::beginTransaction();
        try {
            // Handle photo upload if present
            $photoPath = null;
            if ($request->hasFile('photo')) {
                $photoPath = $request->file('photo')->store('activity-photos', 'public');
            }

            // Create or update submission
            $submission = ActivitySubmission::updateOrCreate(
                [
                    'student_id' => $student->id,
                    'activity_id' => $validated['activity_id'],
                    'date' => $validated['date'],
                ],
                array_filter([
                    'time' => $request->input('time'),
                    'photo' => $photoPath, // Only update if new photo uploaded
                    'status' => 'pending',
                ], function ($value) {
                    return $value !== null;
                })
            );

            // Delete existing details from old table (for backward compatibility)
            ActivityDetail::where('submission_id', $submission->id)->delete();

            // Save to appropriate detail table based on activity_id
            $this->saveActivityDetails($submission->id, $validated['activity_id'], $request);

            DB::commit();

            return back()->with('success', 'Kegiatan berhasil disimpan!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menyimpan kegiatan: ' . $e->getMessage()]);
        }
    }

    /**
     * Save activity details to appropriate table based on activity_id
     */
    private function saveActivityDetails($submissionId, $activityId, Request $request)
    {
        switch ($activityId) {
            case 1: // Bangun Pagi
                return $this->saveBangunPagiDetails($submissionId, $request);
            case 2: // Beribadah
                return $this->saveBeribadahDetails($submissionId, $request);
            case 3: // Berolahraga
                return $this->saveBerolahragaDetails($submissionId, $request);
            case 4: // Gemar Belajar
                return $this->saveGemarBelajarDetails($submissionId, $request);
            case 5: // Makan Sehat
                return $this->saveMakanSehatDetails($submissionId, $request);
            case 6: // Bermasyarakat
                return $this->saveBermasyarakatDetails($submissionId, $request);
            case 7: // Tidur Cepat
                return $this->saveTidurCepatDetails($submissionId, $request);
        }
    }

    private function saveBangunPagiDetails($submissionId, Request $request)
    {
        // Map old form fields to new table structure
        // Old form: membereskan_tempat_tidur, mandi, berpakaian_rapi, sarapan
        // New table: tidy_bed, open_window, morning_prayer, tidy_room
        
        // Get existing submission to check for time
        $submission = ActivitySubmission::find($submissionId);
        
        BangunPagiDetail::updateOrCreate(
            ['submission_id' => $submissionId],
            [
                'wake_up_time' => $request->input('time') ?? $submission->time, // Use submitted time or existing time
                'tidy_bed' => $request->boolean('membereskan_tempat_tidur'), // Maps directly
                'open_window' => $request->boolean('berpakaian_rapi'), // Repurposed field
                'morning_prayer' => $request->boolean('sarapan'), // Repurposed field
                'tidy_room' => $request->boolean('mandi'), // Repurposed field
                'sleep_duration' => null, // Not collected in old form
            ]
        );
    }

    private function saveBerolahragaDetails($submissionId, Request $request)
    {
        // Extract duration number from dropdown value like "10 Menit", "20 Menit"
        $waktuInput = $request->input('waktu_berolahraga');
        $duration = null;
        if ($waktuInput) {
            // Extract number from string like "10 Menit" -> 10
            preg_match('/\d+/', $waktuInput, $matches);
            $duration = isset($matches[0]) ? (int)$matches[0] : null;
        }

        BerolahragaDetail::updateOrCreate(
            ['submission_id' => $submissionId],
            [
                'exercise_type' => $request->boolean('berolahraga') ? 'Olahraga' : null,
                'exercise_time' => null, // Not used for now
                'exercise_duration' => $duration, // Store as integer (minutes)
                'repetition' => null, // Not in old form
            ]
        );
    }

    private function saveBeribadahDetails($submissionId, Request $request)
    {
        BeribadahDetail::updateOrCreate(
            ['submission_id' => $submissionId],
            [
                // Muslim
                'subuh' => $request->boolean('subuh'),
                'dzuhur' => $request->boolean('dzuhur'),
                'ashar' => $request->boolean('ashar'),
                'maghrib' => $request->boolean('maghrib'),
                'isya' => $request->boolean('isya'),
                'mengaji' => $request->boolean('mengaji'),
                'berdoa' => $request->boolean('berdoa'),
                'bersedekah' => $request->boolean('bersedekah'),
                'lainnya' => $request->boolean('lainnya'),
                // Non-Muslim
                'doa_pagi' => $request->boolean('doa_pagi'),
                'baca_firman' => $request->boolean('baca_firman'),
                'renungan' => $request->boolean('renungan'),
                'doa_malam' => $request->boolean('doa_malam'),
                'ibadah_bersama' => $request->boolean('ibadah_bersama'),
            ]
        );
    }

    private function saveGemarBelajarDetails($submissionId, Request $request)
    {
        // Build study_type from checkboxes
        $types = [];
        if ($request->boolean('gemar_belajar')) $types[] = 'Gemar Belajar';
        if ($request->boolean('ekstrakurikuler')) $types[] = 'Ekstrakurikuler';
        if ($request->boolean('bimbingan_belajar')) $types[] = 'Bimbingan Belajar';
        if ($request->boolean('mengerjakan_tugas')) $types[] = 'Mengerjakan Tugas';
        if ($request->boolean('lainnya')) $types[] = 'Lainnya';
        
        GemarBelajarDetail::updateOrCreate(
            ['submission_id' => $submissionId],
            [
                'subject' => implode(', ', $types), // Store all selected types
                'study_time' => null,
                'study_duration' => null,
                'study_type' => implode(', ', $types),
            ]
        );
    }

    private function saveMakanSehatDetails($submissionId, Request $request)
    {
        MakanSehatDetail::updateOrCreate(
            ['submission_id' => $submissionId],
            [
                'karbohidrat' => $request->input('karbohidrat_name'),
                'protein' => $request->input('protein_name'),
                'sayur' => $request->input('sayur_name'),
                'buah' => $request->input('buah_name'),
            ]
        );
    }

    private function saveBermasyarakatDetails($submissionId, Request $request)
    {
        BermasyarakatDetail::updateOrCreate(
            ['submission_id' => $submissionId],
            [
                'activity_type' => $request->input('jenis_kegiatan'),
                'activity_description' => $request->input('deskripsi_kegiatan'),
                'activity_duration' => $request->input('durasi_kegiatan'),
                'with_whom' => $request->input('dengan_siapa'),
                'tarka' => $request->boolean('tarka'),
                'kerja_bakti' => $request->boolean('kerja_bakti'),
                'gotong_royong' => $request->boolean('gotong_royong'),
                'lainnya' => $request->boolean('lainnya'),
            ]
        );
    }

    private function saveTidurCepatDetails($submissionId, Request $request)
    {
        TidurCepatDetail::updateOrCreate(
            ['submission_id' => $submissionId],
            [
                'sleep_time' => $request->input('jam_tidur'),
                'brush_teeth' => $request->boolean('gosok_gigi'),
                'wash_face' => $request->boolean('cuci_muka'),
                'change_clothes' => $request->boolean('ganti_baju'),
                'prayer_before_sleep' => $request->boolean('berdoa_sebelum_tidur'),
                'turn_off_gadget' => $request->boolean('matikan_gadget'),
                'tidy_bed_before_sleep' => $request->boolean('rapikan_tempat_tidur'),
            ]
        );
    }
}

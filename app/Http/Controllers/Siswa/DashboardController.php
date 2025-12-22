<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\ActivitySubmission;
use App\Models\ActivityDetail;
use App\Models\Student;
use App\Models\BangunPagiDetail;
use App\Models\BeribadahDetail;
use App\Models\BerolahragaDetail;
use App\Models\GemarBelajarDetail;
use App\Models\MakanSehatDetail;
use App\Models\BermasyarakatDetail;
use App\Models\TidurCepatDetail;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Update the biodata for the current student.
     */
    public function biodataUpdate(Request $request)
    {
        $user = auth()->user();
        $student = Student::where('user_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'hobi' => 'nullable|string',
            'cita_cita' => 'nullable|string',
            'makanan_kesukaan' => 'nullable|string',
            'minuman_kesukaan' => 'nullable|string',
            'hewan_kesukaan' => 'nullable|string',
            'tidak_disukai' => 'nullable|string',
        ]);

        $biodata = \App\Models\BiodataSiswa::firstOrNew([
            'student_id' => $student->id,
        ]);

        $biodata->hobi = $validated['hobi'] ?? '';
        $biodata->cita_cita = $validated['cita_cita'] ?? '';
        $biodata->makanan_kesukaan = $validated['makanan_kesukaan'] ?? '';
        $biodata->minuman_kesukaan = $validated['minuman_kesukaan'] ?? '';
        $biodata->hewan_kesukaan = $validated['hewan_kesukaan'] ?? '';
        $biodata->sesuatu_tidak_suka = $validated['tidak_disukai'] ?? '';
        $biodata->save();

        return redirect()->route('siswa.biodata')->with('success', 'Biodata berhasil diperbarui!');
    }
    /**
     * Display the siswa dashboard.
     */
    public function index(): Response
    {
        $activities = Activity::orderBy('order')->get();

        /** @var \App\Models\User $user */
        $user = auth()->user();
        $student = Student::where('user_id', $user->id)->first();

        // Calculate completion percentage for current month
        $completionPercentage = 0;
        $completedDays = 0;
        
        if ($student) {
            $now = now();
            $startOfMonth = $now->copy()->startOfMonth();
            $endOfMonth = $now->copy()->endOfMonth();
            $daysInMonth = $now->daysInMonth;
            
            // Total possible submissions = days in month × 7 activities
            $totalPossible = $daysInMonth * 7;
            
            // Count actual submissions for this month
            $submissionsCount = ActivitySubmission::where('student_id', $student->id)
                ->whereBetween('date', [$startOfMonth, $endOfMonth])
                ->count();
            
            // Calculate percentage
            if ($totalPossible > 0) {
                $completionPercentage = round(($submissionsCount / $totalPossible) * 100);
            }
            
            // Count days with all 7 activities completed
            $completedDays = ActivitySubmission::where('student_id', $student->id)
                ->whereBetween('date', [$startOfMonth, $endOfMonth])
                ->selectRaw('DATE(date) as submission_date, COUNT(DISTINCT activity_id) as activity_count')
                ->groupBy('submission_date')
                ->having('activity_count', '=', 7)
                ->count();
        }

        return Inertia::render('siswa/dashboard', [
            'activities' => $activities,
            'completionPercentage' => $completionPercentage,
            'completedDays' => $completedDays,
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
        $user = auth()->user();
        $student = Student::where('user_id', $user->id)->first();
        $biodata = null;
        if ($student) {
            $raw = \App\Models\BiodataSiswa::where('student_id', $student->id)->first();
            if ($raw) {
                $biodata = [
                    'hobbies' => $raw->hobi ? preg_split('/[,;\n]+/', $raw->hobi) : [],
                    'aspirations' => $raw->cita_cita ? preg_split('/[,;\n]+/', $raw->cita_cita) : [],
                    'favorite_foods' => $raw->makanan_kesukaan ? preg_split('/[,;\n]+/', $raw->makanan_kesukaan) : [],
                    'favorite_drinks' => $raw->minuman_kesukaan ? preg_split('/[,;\n]+/', $raw->minuman_kesukaan) : [],
                    'favorite_animals' => $raw->hewan_kesukaan ? preg_split('/[,;\n]+/', $raw->hewan_kesukaan) : [],
                    'disliked_items' => $raw->sesuatu_tidak_suka ? preg_split('/[,;\n]+/', $raw->sesuatu_tidak_suka) : [],
                ];
            }
        }
        return Inertia::render('siswa/profile/biodata', [
            'auth' => [
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
            ],
            'biodata' => $biodata,
        ]);
    }

    /**
     * Display the biodata edit page.
     */
    public function biodataEdit(): Response
    {
        $user = auth()->user();
        $student = Student::where('user_id', $user->id)->first();
        $biodata = null;
        if ($student) {
            $raw = \App\Models\BiodataSiswa::where('student_id', $student->id)->first();
            if ($raw) {
                $biodata = [
                    'hobbies' => $raw->hobi ? preg_split('/[,;\n]+/', $raw->hobi) : [],
                    'aspirations' => $raw->cita_cita ? preg_split('/[,;\n]+/', $raw->cita_cita) : [],
                    'favorite_foods' => $raw->makanan_kesukaan ? preg_split('/[,;\n]+/', $raw->makanan_kesukaan) : [],
                    'favorite_drinks' => $raw->minuman_kesukaan ? preg_split('/[,;\n]+/', $raw->minuman_kesukaan) : [],
                    'favorite_animals' => $raw->hewan_kesukaan ? preg_split('/[,;\n]+/', $raw->hewan_kesukaan) : [],
                    'disliked_items' => $raw->sesuatu_tidak_suka ? preg_split('/[,;\n]+/', $raw->sesuatu_tidak_suka) : [],
                ];
            }
        }
        return Inertia::render('siswa/profile/biodata-edit', [
            'auth' => [
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
            ],
            'biodata' => $biodata,
        ]);
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
                ->map(function ($submission) {
                    return [
                        'id' => $submission->id,
                        'date' => $submission->date->format('Y-m-d'), // Explicit format to avoid timezone issues
                        'status' => $submission->status,
                        'activity_id' => $submission->activity_id,
                    ];
                })
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
                $details = [];
                if ($submission->bangunPagiDetail) {
                    $detail = $submission->bangunPagiDetail;
                    $details = [
                        'membereskan_tempat_tidur' => [
                            'label' => 'Membereskan Tempat Tidur',
                            'is_checked' => $detail->membereskan_tempat_tidur,
                        ],
                        'mandi' => [
                            'label' => 'Mandi',
                            'is_checked' => $detail->mandi,
                        ],
                        'berpakaian_rapi' => [
                            'label' => 'Berpakaian Rapi',
                            'is_checked' => $detail->berpakaian_rapi,
                        ],
                        'sarapan' => [
                            'label' => 'Sarapan',
                            'is_checked' => $detail->sarapan,
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
                            'is_checked' => $detail->berolahraga,
                        ],
                        'waktu_berolahraga' => [
                            'label' => 'Waktu Berolahraga',
                            'value' => $detail->waktu_berolahraga ?? null,
                        ],
                        'exercise_type' => [
                            'label' => 'Jenis Olahraga',
                            'value' => $detail->exercise_type ?? null,
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
                    
                    $details = [
                        'gemar_belajar' => [
                            'label' => 'Gemar Belajar',
                            'is_checked' => $detail->gemar_belajar,
                        ],
                        'ekstrakurikuler' => [
                            'label' => 'Ekstrakurikuler',
                            'is_checked' => $detail->ekstrakurikuler,
                        ],
                        'bimbingan_belajar' => [
                            'label' => 'Bimbingan Belajar',
                            'is_checked' => $detail->bimbingan_belajar,
                        ],
                        'mengerjakan_tugas' => [
                            'label' => 'Mengerjakan Tugas',
                            'is_checked' => $detail->mengerjakan_tugas,
                        ],
                        'lainnya' => [
                            'label' => 'Lainnya',
                            'is_checked' => $detail->lainnya,
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
        if ($todaySubmission) {
            $details = null;
            if ($todaySubmission->beribadahDetail) {
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
            }
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
        $currentMonth = \Carbon\Carbon::parse($today)->month;
        $currentYear = \Carbon\Carbon::parse($today)->year;
        $photoCountThisMonth = ActivitySubmission::where('student_id', $student->id)
            ->where('activity_id', $activity->id)
            ->whereYear('date', $currentYear)
            ->whereMonth('date', $currentMonth)
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
        if ($todaySubmission) {
            $details = null;
            if ($todaySubmission->beribadahDetail) {
                $detail = $todaySubmission->beribadahDetail;
                $details = [
                    'doa_pagi' => ['label' => 'Doa Pagi', 'is_checked' => $detail->doa_pagi],
                    'baca_firman' => ['label' => 'Baca Firman', 'is_checked' => $detail->baca_firman],
                    'renungan' => ['label' => 'Renungan', 'is_checked' => $detail->renungan],
                    'doa_malam' => ['label' => 'Doa Malam', 'is_checked' => $detail->doa_malam],
                    'ibadah_bersama' => ['label' => 'Ibadah Bersama', 'is_checked' => $detail->ibadah_bersama],
                ];
            }
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
        $currentMonth = \Carbon\Carbon::parse($today)->month;
        $currentYear = \Carbon\Carbon::parse($today)->year;
        $photoCountThisMonth = ActivitySubmission::where('student_id', $student->id)
            ->where('activity_id', $activity->id)
            ->whereYear('date', $currentYear)
            ->whereMonth('date', $currentMonth)
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
        $currentMonth = \Carbon\Carbon::parse($today)->month;
        $currentYear = \Carbon\Carbon::parse($today)->year;
        
        $photoCountThisMonth = ActivitySubmission::where('student_id', $student->id)
            ->where('activity_id', $activity->id)
            ->whereYear('date', $currentYear)
            ->whereMonth('date', $currentMonth)
            ->whereNotNull('photo')
            ->where('photo', '!=', '')
            ->count();

        // Get today's submission with details
        $todaySubmission = ActivitySubmission::with('bangunPagiDetail')
            ->where('student_id', $student->id)
            ->where('activity_id', $activity->id)
            ->where('date', $today)
            ->first();

        // Format submission data
        $submissionData = null;
        if ($todaySubmission) {
            $details = null;
            if ($todaySubmission->bangunPagiDetail) {
                $detail = $todaySubmission->bangunPagiDetail;
                $details = [
                    'membereskan_tempat_tidur' => [
                        'label' => 'Membereskan Tempat Tidur',
                        'is_checked' => $detail->membereskan_tempat_tidur ?? false,
                        'value' => null,
                    ],
                    'mandi' => [
                        'label' => 'Mandi',
                        'is_checked' => $detail->mandi ?? false,
                        'value' => null,
                    ],
                    'berpakaian_rapi' => [
                        'label' => 'Berpakaian Rapi',
                        'is_checked' => $detail->berpakaian_rapi ?? false,
                        'value' => null,
                    ],
                    'sarapan' => [
                        'label' => 'Sarapan',
                        'is_checked' => $detail->sarapan ?? false,
                        'value' => null,
                    ],
                ];
            }
            $submissionData = [
                'id' => $todaySubmission->id,
                'date' => $todaySubmission->date,
                'time' => $todaySubmission->time,
                'photo' => $todaySubmission->photo,
                'status' => $todaySubmission->status,
                'details' => $details,
            ];
        }

        $photoUploadedToday = $todaySubmission && $todaySubmission->photo;

        return Inertia::render('siswa/activities/detail/bangun-pagi-detail', [
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
        if ($todaySubmission) {
            $details = null;
            if ($todaySubmission->berolahragaDetail) {
                $detail = $todaySubmission->berolahragaDetail;
                $details = [
                    'waktu_berolahraga' => ['label' => 'Waktu Berolahraga', 'is_checked' => true, 'value' => $detail->waktu_berolahraga],
                ];
            }
            $submissionData = [
                'id' => $todaySubmission->id,
                'date' => $todaySubmission->date->format('Y-m-d'),
                'time' => $todaySubmission->time,
                'photo' => $todaySubmission->photo,
                'status' => $todaySubmission->status,
                'details' => $details,
            ];
        }

        $currentMonth = \Carbon\Carbon::parse($today)->month;
        $currentYear = \Carbon\Carbon::parse($today)->year;
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
        if ($todaySubmission) {
            $details = null;
            if ($todaySubmission->gemarBelajarDetail) {
                $detail = $todaySubmission->gemarBelajarDetail;
                $details = [
                    'gemar_belajar' => ['label' => 'Gemar Belajar', 'is_checked' => (bool)$detail->gemar_belajar],
                    'ekstrakurikuler' => ['label' => 'Ekstrakurikuler', 'is_checked' => (bool)$detail->ekstrakurikuler],
                    'bimbingan_belajar' => ['label' => 'Bimbingan Belajar', 'is_checked' => (bool)$detail->bimbingan_belajar],
                    'mengerjakan_tugas' => ['label' => 'Mengerjakan Tugas', 'is_checked' => (bool)$detail->mengerjakan_tugas],
                    'lainnya' => ['label' => 'Lainnya', 'is_checked' => (bool)$detail->lainnya],
                ];
            }
            $submissionData = [
                'id' => $todaySubmission->id,
                'date' => $todaySubmission->date->format('Y-m-d'),
                'time' => $todaySubmission->time,
                'photo' => $todaySubmission->photo,
                'status' => $todaySubmission->status,
                'details' => $details,
            ];
        }

        $currentMonth = \Carbon\Carbon::parse($today)->month;
        $currentYear = \Carbon\Carbon::parse($today)->year;
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
        if ($todaySubmission) {
            $details = null;
            if ($todaySubmission->makanSehatDetail) {
                $detail = $todaySubmission->makanSehatDetail;
                $details = [
                    'karbohidrat' => ['label' => 'Karbohidrat', 'is_checked' => true, 'value' => $detail->karbohidrat],
                    'protein' => ['label' => 'Protein', 'is_checked' => true, 'value' => $detail->protein],
                    'sayur' => ['label' => 'Sayur', 'is_checked' => true, 'value' => $detail->sayur],
                    'buah' => ['label' => 'Buah', 'is_checked' => true, 'value' => $detail->buah],
                ];
            }
            $submissionData = [
                'id' => $todaySubmission->id,
                'date' => $todaySubmission->date->format('Y-m-d'),
                'time' => $todaySubmission->time,
                'photo' => $todaySubmission->photo,
                'status' => $todaySubmission->status,
                'details' => $details,
            ];
        }

        $currentMonth = \Carbon\Carbon::parse($today)->month;
        $currentYear = \Carbon\Carbon::parse($today)->year;
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
        if ($todaySubmission) {
            $details = null;
            if ($todaySubmission->bermasyarakatDetail) {
                $detail = $todaySubmission->bermasyarakatDetail;
                $details = [
                    'tarka' => ['label' => 'Tarka', 'is_checked' => $detail->tarka],
                    'kerja_bakti' => ['label' => 'Kerja Bakti', 'is_checked' => $detail->kerja_bakti],
                    'gotong_royong' => ['label' => 'Gotong Royong', 'is_checked' => $detail->gotong_royong],
                    'lainnya' => ['label' => 'Lainnya', 'is_checked' => $detail->lainnya],
                ];
            }
            $submissionData = [
                'id' => $todaySubmission->id,
                'date' => $todaySubmission->date->format('Y-m-d'),
                'time' => $todaySubmission->time,
                'photo' => $todaySubmission->photo,
                'status' => $todaySubmission->status,
                'details' => $details,
            ];
        }

        $currentMonth = \Carbon\Carbon::parse($today)->month;
        $currentYear = \Carbon\Carbon::parse($today)->year;
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
        if ($todaySubmission) {
            $details = null;
            if ($todaySubmission->tidurCepatDetail) {
                $detail = $todaySubmission->tidurCepatDetail;
                $sleepTime = $detail->sleep_time ? \Carbon\Carbon::parse($detail->sleep_time)->format('H:i') : '';
                $details = [
                    'waktu_tidur' => ['label' => 'Waktu Tidur', 'is_checked' => true, 'value' => $sleepTime],
                ];
            }
            $submissionData = [
                'id' => $todaySubmission->id,
                'date' => $todaySubmission->date->format('Y-m-d'),
                'time' => $todaySubmission->time,
                'photo' => $todaySubmission->photo,
                'status' => $todaySubmission->status,
                'details' => $details,
            ];
        }

        $currentMonth = \Carbon\Carbon::parse($today)->month;
        $currentYear = \Carbon\Carbon::parse($today)->year;
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
            'date' => 'nullable|date',
            'time' => 'nullable|date_format:H:i:s,H:i',
            'membereskan_tempat_tidur' => 'nullable',
            'mandi' => 'nullable',
            'berpakaian_rapi' => 'nullable',
            'sarapan' => 'nullable',
            'photo' => 'nullable|image|max:2048',
        ]);

        /** @var \App\Models\User $user */
        $user = auth()->user();
        
        // Get student record
        $student = Student::where('user_id', $user->id)->firstOrFail();

        // Use date from request if provided (ensures sync with frontend display)
        // Otherwise fallback to server date or test_date
        $submissionDateStr = $request->input('date') 
            ?? (request('test_date') && config('app.env') !== 'production'
                ? request('test_date')
                : now()->format('Y-m-d'));

        // Check if user is trying to upload a photo
        if ($request->hasFile('photo')) {
            // Get the month and year from the server-determined date
            $submissionDate = \Carbon\Carbon::parse($submissionDateStr);
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
                ->where('date', $submissionDateStr)
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
            
            // Use server-side date (submissionDateStr) to prevent students from controlling the date
            $submission = ActivitySubmission::updateOrCreate(
                [
                    'student_id' => $student->id,
                    'activity_id' => $validated['activity_id'],
                    'date' => $submissionDateStr,
                ],
                $dataToUpdate
            );

            // Store activity details (checkboxes) - Convert string to boolean
            $membereskan = $request->input('membereskan_tempat_tidur');
            $mandi = $request->input('mandi');
            $berpakaianRapi = $request->input('berpakaian_rapi');
            $sarapan = $request->input('sarapan');
            
            $details = [
                [
                    'field_type' => 'checkbox',
                    'field_name' => 'membereskan_tempat_tidur',
                    'field_label' => 'Membereskan Tempat Tidur',
                    'is_checked' => ($membereskan === '1' || $membereskan === 1 || $membereskan === true),
                ],
                [
                    'field_type' => 'checkbox',
                    'field_name' => 'mandi',
                    'field_label' => 'Mandi',
                    'is_checked' => ($mandi === '1' || $mandi === 1 || $mandi === true),
                ],
                [
                    'field_type' => 'checkbox',
                    'field_name' => 'berpakaian_rapi',
                    'field_label' => 'Berpakaian Rapi',
                    'is_checked' => ($berpakaianRapi === '1' || $berpakaianRapi === 1 || $berpakaianRapi === true),
                ],
                [
                    'field_type' => 'checkbox',
                    'field_name' => 'sarapan',
                    'field_label' => 'Sarapan',
                    'is_checked' => ($sarapan === '1' || $sarapan === 1 || $sarapan === true),
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
        // Basic validation - date is accepted but server will assign the date on submission
        $validated = $request->validate([
            'activity_id' => 'required|exists:activities,id',
            'date' => 'nullable|date',
            'photo' => 'nullable|image|max:2048',
        ]);

        /** @var \App\Models\User $user */
        $user = auth()->user();
        
        // Get student record
        $student = Student::where('user_id', $user->id)->firstOrFail();

        // Use date from request if provided (ensures sync with frontend display)
        // Otherwise fallback to server date or test_date
        $submissionDateStr = $request->input('date') 
            ?? (request('test_date') && config('app.env') !== 'production'
                ? request('test_date')
                : now()->format('Y-m-d'));

        // Check if user is trying to upload a photo
        if ($request->hasFile('photo')) {
            // Get the month and year from the server-determined date
            $submissionDate = \Carbon\Carbon::parse($submissionDateStr);
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
                ->where('date', $submissionDateStr)
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
            // Use server-determined date to create/update (prevents client from setting it)
            $submission = ActivitySubmission::updateOrCreate(
                [
                    'student_id' => $student->id,
                    'activity_id' => $validated['activity_id'],
                    'date' => $submissionDateStr,
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
        // Get existing submission to check for time
        $submission = ActivitySubmission::find($submissionId);
        // Convert string '0'/'1' to boolean, default to false if null
        $membereskanTempatTidur = $request->input('membereskan_tempat_tidur');
        $mandi = $request->input('mandi');
        $berpakaianRapi = $request->input('berpakaian_rapi');
        $sarapan = $request->input('sarapan');
        BangunPagiDetail::updateOrCreate(
            ['submission_id' => $submissionId],
            [
                'jam_bangun' => $request->input('time') ?? $submission->time,
                'membereskan_tempat_tidur' => $membereskanTempatTidur === '1' || $membereskanTempatTidur === 1 || $membereskanTempatTidur === true,
                'mandi' => $mandi === '1' || $mandi === 1 || $mandi === true,
                'berpakaian_rapi' => $berpakaianRapi === '1' || $berpakaianRapi === 1 || $berpakaianRapi === true,
                'sarapan' => $sarapan === '1' || $sarapan === 1 || $sarapan === true,
            ]
        );
    }
    
    private function saveBerolahragaDetails($submissionId, Request $request)
    {
        // Extract duration number from dropdown value like "10 Menit", "20 Menit"
        $waktuInput = $request->input('waktu_berolahraga');
        BerolahragaDetail::updateOrCreate(
            ['submission_id' => $submissionId],
            [
                'berolahraga' => $request->boolean('berolahraga'),
                'waktu_berolahraga' => $waktuInput,
                'exercise_type' => $request->input('exercise_type'),
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
        GemarBelajarDetail::updateOrCreate(
            ['submission_id' => $submissionId],
            [
                'gemar_belajar' => $request->boolean('gemar_belajar'),
                'ekstrakurikuler' => $request->boolean('ekstrakurikuler'),
                'bimbingan_belajar' => $request->boolean('bimbingan_belajar'),
                'mengerjakan_tugas' => $request->boolean('mengerjakan_tugas'),
                'lainnya' => $request->boolean('lainnya'),
            ]
        );
    }

    private function saveMakanSehatDetails($submissionId, Request $request)
    {
        MakanSehatDetail::updateOrCreate(
            ['submission_id' => $submissionId],
            [
                'karbohidrat' => $request->input('karbohidrat'),
                'protein' => $request->input('protein'),
                'sayur' => $request->input('sayur'),
                'buah' => $request->input('buah'),
            ]
        );
    }

    private function saveBermasyarakatDetails($submissionId, Request $request)
    {
        BermasyarakatDetail::updateOrCreate(
            ['submission_id' => $submissionId],
            [
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
            ]
        );
    }
}

<?php

namespace App\Http\Controllers\Orangtua;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\ActivitySubmission;
use App\Models\ParentModel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the orangtua dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Get parent record
        $parent = ParentModel::where('user_id', $user->id)
            ->with(['students.class', 'students.user'])
            ->first();

        if (!$parent) {
            return Inertia::render('orangtua/page', [
                'students' => [],
                'submissions' => [],
                'activities' => [],
            ]);
        }

        // Get students with their class information
        $students = $parent->students->map(function ($student) {
            return [
                'id' => $student->id,
                'name' => $student->user->name ?? 'Unknown',
                'class' => $student->class->name ?? 'N/A',
            ];
        });

        // Get all activities
        $activities = Activity::orderBy('order')->get()->map(function ($activity) {
            return [
                'id' => $activity->id,
                'title' => $activity->title,
                'icon' => $activity->icon ?? '📋',
                'color' => $activity->color ?? 'bg-blue-400',
            ];
        });

        // Get all submissions for parent's students
        $studentIds = $parent->students->pluck('id');
        $submissions = ActivitySubmission::whereIn('student_id', $studentIds)
            ->with(['student.user', 'activity'])
            ->orderBy('date', 'desc')
            ->orderBy('time', 'desc')
            ->get()
            ->map(function ($submission) {
                // Ensure properly formatted Y-m-d date string to avoid timezone shifts
                $formattedDate = \Carbon\Carbon::parse($submission->date)->format('Y-m-d');
                
                return [
                    'id' => $submission->id,
                    'studentId' => $submission->student_id,
                    'studentName' => $submission->student->user->name ?? 'Unknown',
                    'activityTitle' => $submission->activity->title ?? 'Unknown',
                    'activityId' => $submission->activity_id,
                    'date' => $formattedDate,
                    'time' => $submission->time ?? '00:00',
                    'photo' => $submission->photo ?? '',
                    'status' => $submission->status,
                    'submittedAt' => $submission->created_at->toDateTimeString(),
                    'notes' => $submission->notes ?? '',
                ];
            });

        return Inertia::render('orangtua/page', [
            'students' => $students,
            'submissions' => $submissions,
            'activities' => $activities,
        ]);
    }

    /**
     * Display the daily report detail page for a specific date and student.
     */
    public function detail(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        $user = $request->user();
        $parent = ParentModel::where('user_id', $user->id)->first();

        if (!$parent) {
            return redirect()->route('orangtua.dashboard');
        }

        $studentId = $request->query('student_id');
        $date = $request->query('date');

        if (!$studentId || !$date) {
            return redirect()->route('orangtua.dashboard');
        }

        // Verify student belongs to parent
        if (!$parent->students->contains($studentId)) {
            return redirect()->route('orangtua.dashboard')->with('error', 'Unauthorized');
        }

        $student = $parent->students->find($studentId);

        // Parse the date to ensure we only use the date part (not timestamp)
        $dateOnly = \Carbon\Carbon::parse($date)->toDateString();

        // Get all activities ordered by execution order
        $activities = Activity::orderBy('order')->get();

        // Get all submissions for this day
        $submissions = ActivitySubmission::where('student_id', $studentId)
            ->whereDate('date', $dateOnly)
            ->with([
                'bangunPagiDetail',
                'berolahragaDetail',
                'beribadahDetail',
                'gemarBelajarDetail',
                'makanSehatDetail',
                'bermasyarakatDetail',
                'tidurCepatDetail'
            ])
            ->get()
            ->keyBy('activity_id');

        // Map activities with their submission status
        $activityList = $activities->map(function ($activity) use ($submissions) {
            $submission = $submissions->get($activity->id);
            
            $details = [];
            if ($submission) {
                // Get the appropriate detail relationship based on activity ID
                $detailRelation = null;
                switch ($activity->id) {
                    case 1: $detailRelation = $submission->bangunPagiDetail; break;
                    case 2: $detailRelation = $submission->beribadahDetail; break;
                    case 3: $detailRelation = $submission->berolahragaDetail; break;
                    case 4: $detailRelation = $submission->bermasyarakatDetail; break;
                    case 5: $detailRelation = $submission->gemarBelajarDetail; break;
                    case 6: $detailRelation = $submission->makanSehatDetail; break;
                    case 7: $detailRelation = $submission->tidurCepatDetail; break;
                }

                if ($detailRelation) {
                    // Define proper labels for each field
                    $fieldLabels = [
                        // Bangun Pagi
                        'jam_bangun' => 'Jam Bangun',
                        'membereskan_tempat_tidur' => 'Merapikan Tempat Tidur',
                        'open_window' => 'Membuka Jendela',
                        'morning_prayer' => 'Berdoa Pagi',
                        'tidy_room' => 'Merapikan Kamar',
                        'sleep_duration' => 'Durasi Tidur',
                        
                        // Beribadah
                        'shubuh' => 'Sholat Subuh',
                        'dzuhur' => 'Sholat Dzuhur',
                        'ashar' => 'Sholat Ashar',
                        'maghrib' => 'Sholat Maghrib',
                        'isya' => 'Sholat Isya',
                        'read_quran' => 'Mengaji',
                        
                        // Berolahraga
                        'exercise_type' => 'Jenis Olahraga',
                        'duration' => 'Durasi',
                        
                        // Bermasyarakat
                        'activity_type' => 'Jenis Kegiatan',
                        'activity_description' => 'Deskripsi Kegiatan',
                        'activity_duration' => 'Durasi Kegiatan',
                        'with_whom' => 'Bersama',
                        'tarka' => 'TARKA',
                        'kerja_bakti' => 'Kerja Bakti',
                        'gotong_royong' => 'Gotong Royong',
                        'lainnya' => 'Lainnya',
                        
                        // Gemar Belajar
                        'subject' => 'Mata Pelajaran',
                        'study_time' => 'Waktu Belajar',
                        'study_duration' => 'Durasi Belajar',
                        'study_type' => 'Jenis Belajar',
                        
                        // Makan Sehat
                        'karbohidrat' => 'Karbohidrat',
                        'protein' => 'Protein',
                        'sayur' => 'Sayur',
                        'buah' => 'Buah',
                        
                        // Tidur Cepat
                        'sleep_time' => 'Jam Tidur',
                        'brush_teeth' => 'Sikat Gigi',
                        'night_prayer' => 'Doa Malam',
                    ];
                    
                    // Convert the detail model to array and format it
                    $detailArray = $detailRelation->toArray();
                    foreach ($detailArray as $key => $value) {
                        // Skip meta keys
                        if (in_array($key, ['id', 'submission_id', 'created_at', 'updated_at'])) {
                            continue;
                        }
                        
                        // Get label from mapping or generate from key
                        $label = $fieldLabels[$key] ?? ucwords(str_replace('_', ' ', $key));
                        
                        // Boolean fields list
                        $booleanFields = ['membereskan_tempat_tidur', 'open_window', 'morning_prayer', 'tidy_room', 'shubuh', 'dzuhur', 'ashar', 'maghrib', 'isya', 'read_quran', 'tarka', 'kerja_bakti', 'gotong_royong', 'lainnya', 'brush_teeth', 'night_prayer'];
                        
                        // Special handling for Tidur Cepat (Activity 7) - only show time
                        if ($activity->id === 7) {
                            if ($key === 'sleep_time' && $value !== null && $value !== '') {
                                $details[$key] = [
                                    'label' => $label . ': ' . $value,
                                    'is_checked' => true
                                ];
                            }
                            continue;
                        }
                        
                        // Handle different value types
                        if (is_bool($value) || in_array($key, $booleanFields)) {
                            // Only show checked items
                            if ((bool) $value) {
                                $details[$key] = [
                                    'label' => $label,
                                    'is_checked' => true
                                ];
                            }
                        } else if ($value !== null && $value !== '' && $value !== 'Tidak Ada') {
                            // For non-boolean values, show as checked with value (skip empty or "Tidak Ada")
                            $details[$key] = [
                                'label' => $label . ': ' . $value,
                                'is_checked' => true
                            ];
                        }
                    }
                }
            }

            return [
                'id' => $activity->id,
                'title' => $activity->title,
                'icon' => $activity->icon ?? '📋',
                'color' => $activity->color ?? 'bg-blue-400',
                'submission' => $submission ? [
                    'id' => $submission->id,
                    'time' => $submission->updated_at->format('H:i:s'),
                    'photo' => $submission->photo,
                    'status' => $submission->status,
                    'details' => $details,
                    'notes' => $submission->notes,
                ] : null
            ];
        });

        return Inertia::render('orangtua/activity-detail', [
            'activities' => $activityList,
            'student' => [
                'id' => $student->id,
                'name' => $student->user->name ?? 'Unknown',
                'class' => $student->class->name ?? 'N/A',
            ],
            'date' => $dateOnly,
        ]);
    }

    /**
     * Approve a submission.
     */
    public function approve(Request $request, ActivitySubmission $submission)
    {
        $user = $request->user();
        $parent = ParentModel::where('user_id', $user->id)->first();

        if (!$parent) {
            return back()->with('error', 'Parent record not found');
        }

        // Check if the submission belongs to parent's student
        if (!$parent->students->contains($submission->student_id)) {
            return back()->with('error', 'Unauthorized');
        }

        $submission->update([
            'status' => 'approved',
            'approved_by' => $parent->id,
            'approved_at' => now(),
        ]);

        return back()->with('success', 'Kegiatan berhasil disetujui');
    }

    /**
     * Reject a submission.
     */
    public function reject(Request $request, ActivitySubmission $submission)
    {
        $user = $request->user();
        $parent = ParentModel::where('user_id', $user->id)->first();

        if (!$parent) {
            return back()->with('error', 'Parent record not found');
        }

        // Check if the submission belongs to parent's student
        if (!$parent->students->contains($submission->student_id)) {
            return back()->with('error', 'Unauthorized');
        }

        $submission->update([
            'status' => 'rejected',
            'approved_by' => $parent->id,
            'approved_at' => now(),
            'rejection_reason' => $request->input('reason', 'Tidak memenuhi kriteria'),
        ]);

        return back()->with('success', 'Kegiatan berhasil ditolak');
    }
}

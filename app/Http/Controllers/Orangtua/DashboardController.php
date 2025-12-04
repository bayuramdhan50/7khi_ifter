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
                return [
                    'id' => $submission->id,
                    'studentId' => $submission->student_id,
                    'studentName' => $submission->student->user->name ?? 'Unknown',
                    'activityTitle' => $submission->activity->title ?? 'Unknown',
                    'activityId' => $submission->activity_id,
                    'date' => $submission->date,
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

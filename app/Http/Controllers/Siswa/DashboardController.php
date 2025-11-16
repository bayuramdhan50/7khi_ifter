<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Activity;
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
     */
    public function show(Activity $activity): Response
    {
        // Get next activity
        $nextActivity = Activity::where('order', '>', $activity->order)
            ->orderBy('order', 'asc')
            ->first();

        // Get previous activity
        $previousActivity = Activity::where('order', '<', $activity->order)
            ->orderBy('order', 'desc')
            ->first();

        return Inertia::render('siswa/activity-detail', [
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
        return Inertia::render('siswa/biodata');
    }

    /**
     * Display the biodata edit page.
     */
    public function biodataEdit(): Response
    {
        return Inertia::render('siswa/biodata-edit');
    }

    /**
     * Display the lagu page.
     */
    public function lagu(): Response
    {
        return Inertia::render('siswa/lagu');
    }
}

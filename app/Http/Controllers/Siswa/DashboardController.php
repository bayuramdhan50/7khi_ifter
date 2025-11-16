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
}

<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the siswa dashboard.
     */
    public function index(): Response
    {
        return Inertia::render('siswa/dashboard');
    }
}

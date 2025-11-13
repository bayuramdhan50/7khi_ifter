<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the guru dashboard.
     */
    public function index(): Response
    {
        return Inertia::render('guru/dashboard');
    }
}

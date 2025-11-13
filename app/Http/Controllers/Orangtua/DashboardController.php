<?php

namespace App\Http\Controllers\Orangtua;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the orangtua dashboard.
     */
    public function index(): Response
    {
        return Inertia::render('orangtua/dashboard');
    }
}

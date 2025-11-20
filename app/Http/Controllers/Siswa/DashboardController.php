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
     * Display the bangun pagi history page.
     */
    public function bangunPagiHistory(): Response
    {
        $activity = Activity::where('title', 'LIKE', '%Bangun Pagi%')->firstOrFail();

        return Inertia::render('siswa/activities/history/bangun-pagi-history', [
            'activity' => $activity,
        ]);
    }

    /**
     * Display the berolahraga history page.
     */
    public function berolahragaHistory(): Response
    {
        $activity = Activity::where('title', 'LIKE', '%Berolahraga%')->firstOrFail();

        return Inertia::render('siswa/activities/history/berolahraga-history', [
            'activity' => $activity,
        ]);
    }

    /**
     * Display the gemar belajar history page.
     */
    public function gemarBelajarHistory(): Response
    {
        $activity = Activity::where('title', 'LIKE', '%Gemar Belajar%')->firstOrFail();

        return Inertia::render('siswa/activities/history/gemar-belajar-history', [
            'activity' => $activity,
        ]);
    }

    /**
     * Display the makan sehat history page.
     */
    public function makanSehatHistory(): Response
    {
        $activity = Activity::where('title', 'LIKE', '%Makan%')->firstOrFail();

        return Inertia::render('siswa/activities/history/makan-sehat-history', [
            'activity' => $activity,
        ]);
    }

    /**
     * Display the bermasyarakat history page.
     */
    public function bermasyarakatHistory(): Response
    {
        $activity = Activity::where('title', 'LIKE', '%Bermasyarakat%')->firstOrFail();

        return Inertia::render('siswa/activities/history/bermasyarakat-history', [
            'activity' => $activity,
        ]);
    }

    /**
     * Display the tidur cepat history page.
     */
    public function tidurCepatHistory(): Response
    {
        $activity = Activity::where('title', 'LIKE', '%Tidur%')->firstOrFail();

        return Inertia::render('siswa/activities/history/tidur-cepat-history', [
            'activity' => $activity,
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

        return Inertia::render('siswa/activities/detail/beribadah-muslim-detail', [
            'activity' => $activity,
            'nextActivity' => $nextActivity,
            'previousActivity' => $previousActivity,
        ]);
    }

    /**
     * Display the beribadah nonmuslim detail page.
     */
    public function beribadahNonmuslimDetail(Activity $activity): Response
    {
        $nextActivity = Activity::where('order', '>', $activity->order)->orderBy('order', 'asc')->first();
        $previousActivity = Activity::where('order', '<', $activity->order)->orderBy('order', 'desc')->first();

        return Inertia::render('siswa/activities/detail/beribadah-nonmuslim-detail', [
            'activity' => $activity,
            'nextActivity' => $nextActivity,
            'previousActivity' => $previousActivity,
        ]);
    }

    /**
     * Display the bangun pagi detail page.
     */
    public function bangunPagiDetail(Activity $activity): Response
    {
        $nextActivity = Activity::where('order', '>', $activity->order)->orderBy('order', 'asc')->first();
        $previousActivity = Activity::where('order', '<', $activity->order)->orderBy('order', 'desc')->first();

        return Inertia::render('siswa/activities/detail/bangun-pagi-detail', [
            'activity' => $activity,
            'nextActivity' => $nextActivity,
            'previousActivity' => $previousActivity,
        ]);
    }

    /**
     * Display the berolahraga detail page.
     */
    public function berolahragaDetail(Activity $activity): Response
    {
        $nextActivity = Activity::where('order', '>', $activity->order)->orderBy('order', 'asc')->first();
        $previousActivity = Activity::where('order', '<', $activity->order)->orderBy('order', 'desc')->first();

        return Inertia::render('siswa/activities/detail/berolahraga-detail', [
            'activity' => $activity,
            'nextActivity' => $nextActivity,
            'previousActivity' => $previousActivity,
        ]);
    }

    /**
     * Display the gemar belajar detail page.
     */
    public function gemarBelajarDetail(Activity $activity): Response
    {
        $nextActivity = Activity::where('order', '>', $activity->order)->orderBy('order', 'asc')->first();
        $previousActivity = Activity::where('order', '<', $activity->order)->orderBy('order', 'desc')->first();

        return Inertia::render('siswa/activities/detail/gemar-belajar-detail', [
            'activity' => $activity,
            'nextActivity' => $nextActivity,
            'previousActivity' => $previousActivity,
        ]);
    }

    /**
     * Display the makan sehat detail page.
     */
    public function makanSehatDetail(Activity $activity): Response
    {
        $nextActivity = Activity::where('order', '>', $activity->order)->orderBy('order', 'asc')->first();
        $previousActivity = Activity::where('order', '<', $activity->order)->orderBy('order', 'desc')->first();

        return Inertia::render('siswa/activities/detail/makan-sehat-detail', [
            'activity' => $activity,
            'nextActivity' => $nextActivity,
            'previousActivity' => $previousActivity,
        ]);
    }

    /**
     * Display the bermasyarakat detail page.
     */
    public function bermasyarakatDetail(Activity $activity): Response
    {
        $nextActivity = Activity::where('order', '>', $activity->order)->orderBy('order', 'asc')->first();
        $previousActivity = Activity::where('order', '<', $activity->order)->orderBy('order', 'desc')->first();

        return Inertia::render('siswa/activities/detail/bermasyarakat-detail', [
            'activity' => $activity,
            'nextActivity' => $nextActivity,
            'previousActivity' => $previousActivity,
        ]);
    }

    /**
     * Display the tidur cepat detail page.
     */
    public function tidurCepatDetail(Activity $activity): Response
    {
        $nextActivity = Activity::where('order', '>', $activity->order)->orderBy('order', 'asc')->first();
        $previousActivity = Activity::where('order', '<', $activity->order)->orderBy('order', 'desc')->first();

        return Inertia::render('siswa/activities/detail/tidur-cepat-detail', [
            'activity' => $activity,
            'nextActivity' => $nextActivity,
            'previousActivity' => $previousActivity,
        ]);
    }
}

<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Models\User;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Fortify\Contracts\LoginResponse;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureActions();
        $this->configureViews();
        $this->configureRateLimiting();
        $this->configureLoginResponse();
    }

    /**
     * Configure login response based on user role.
     */
    private function configureLoginResponse(): void
    {
        $this->app->instance(LoginResponse::class, new class implements LoginResponse
        {
            public function toResponse($request)
            {
                $user = $request->user();

                $redirectTo = match ($user->role) {
                    User::ROLE_SISWA => route('siswa.dashboard'),
                    User::ROLE_ORANGTUA => route('orangtua.dashboard'),
                    User::ROLE_GURU => route('guru.dashboard'),
                    User::ROLE_ADMIN => route('admin.dashboard'),
                    default => route('dashboard'),
                };

                return redirect()->intended($redirectTo);
            }
        });
    }

    /**
     * Configure Fortify actions.
     */
    private function configureActions(): void
    {
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::createUsersUsing(CreateNewUser::class);
        
        // Custom authentication: NIS for siswa, username for admin/guru/orangtua
        Fortify::authenticateUsing(function (Request $request) {
            // Check if NIS field is present (for siswa)
            if ($request->filled('nis')) {
                // Find student by nis from students table
                $student = \App\Models\Student::where('nis', $request->nis)->first();
                
                if ($student && $student->user && $student->user->role === User::ROLE_SISWA) {
                    $user = $student->user;
                    if (\Illuminate\Support\Facades\Hash::check($request->password, $user->password)) {
                        return $user;
                    }
                }
            } 
            // Check if username field is present (for admin/guru/orangtua)
            else if ($request->filled('username')) {
                $user = User::where('username', $request->username)
                            ->whereIn('role', [User::ROLE_ADMIN, User::ROLE_GURU, User::ROLE_ORANGTUA])
                            ->first();
                            
                if ($user && \Illuminate\Support\Facades\Hash::check($request->password, $user->password)) {
                    return $user;
                }
            }
            // Fallback to email if neither NIS nor username provided
            else if ($request->filled('email')) {
                $user = User::where('email', $request->email)->first();
                            
                if ($user && \Illuminate\Support\Facades\Hash::check($request->password, $user->password)) {
                    return $user;
                }
            }
            
            return null;
        });
    }

    /**
     * Configure Fortify views.
     */
    private function configureViews(): void
    {
        Fortify::loginView(fn (Request $request) => Inertia::render('auth/login', [
            'canResetPassword' => Features::enabled(Features::resetPasswords()),
            'canRegister' => Features::enabled(Features::registration()),
            'status' => $request->session()->get('status'),
        ]));

        Fortify::resetPasswordView(fn (Request $request) => Inertia::render('auth/reset-password', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]));

        Fortify::requestPasswordResetLinkView(fn (Request $request) => Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::verifyEmailView(fn (Request $request) => Inertia::render('auth/verify-email', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::registerView(fn () => Inertia::render('auth/register'));

        Fortify::twoFactorChallengeView(fn () => Inertia::render('auth/two-factor-challenge'));

        Fortify::confirmPasswordView(fn () => Inertia::render('auth/confirm-password'));
    }

    /**
     * Configure rate limiting.
     */
    private function configureRateLimiting(): void
    {
        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });
    }
}

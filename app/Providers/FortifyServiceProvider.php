<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Actions\Fortify\UpdateUserPassword;
use App\Actions\Fortify\UpdateUserProfileInformation;
use App\Models\User;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Fortify\Actions\RedirectIfTwoFactorAuthenticatable;
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
        Fortify::createUsersUsing(CreateNewUser::class);
        Fortify::updateUserProfileInformationUsing(UpdateUserProfileInformation::class);
        Fortify::updateUserPasswordsUsing(UpdateUserPassword::class);
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::redirectUserForTwoFactorAuthenticationUsing(RedirectIfTwoFactorAuthenticatable::class);

        $this->configureLoginResponse();
        $this->configureAuthentication();
        $this->configureViews();

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())) . '|' . $request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });

        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });
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
                    default => route('login'),
                };

                return redirect()->intended($redirectTo);
            }
        });
    }

    /**
     * Configure custom authentication for NIS (siswa) and username (staff).
     */
    private function configureAuthentication(): void
    {
        Fortify::authenticateUsing(function (Request $request) {
            // Validate required fields
            $request->validate([
                'password' => 'required|string',
            ]);

            // Either NIS or username must be provided
            if (!$request->filled('nis') && !$request->filled('username')) {
                return null;
            }

            // Check if NIS field is present (for siswa)
            if ($request->filled('nis')) {
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

            return null;
        });
    }

    /**
     * Configure Fortify views.
     */
    private function configureViews(): void
    {
        Fortify::loginView(fn(Request $request) => Inertia::render('auth/login', [
            'canResetPassword' => Features::enabled(Features::resetPasswords()),
            'canRegister' => Features::enabled(Features::registration()),
            'status' => $request->session()->get('status'),
        ]));
    }
}

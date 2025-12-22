<?php

namespace App\Http\Controllers\Auth;

use App\Models\Student;
use App\Models\User;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Laravel\Fortify\Contracts\LoginResponse;

class LoginController extends Controller
{
  /**
   * Handle an incoming authentication request.
   */
  public function store(Request $request)
  {
    // Validate only password and either NIS or username
    $request->validate([
      'password' => 'required|string',
    ]);

    // Check rate limiting
    if ($this->isRateLimited($request)) {
      $this->fireLockoutEvent($request);

      return $this->sendLockoutResponse($request);
    }

    // Try to authenticate
    if ($this->authenticate($request)) {
      $request->session()->regenerate();

      return app(LoginResponse::class)->toResponse($request);
    }

    // Authentication failed
    RateLimiter::hit($this->throttleKey($request));
    event(new Failed('web', null, []));

    return back()->withErrors([
      'login_error' => 'NIS/Username atau Password tidak valid.',
    ]);
  }

  /**
   * Attempt to authenticate the request.
   */
  protected function authenticate(Request $request): bool
  {
    // Must have either NIS or username
    if (!$request->filled('nis') && !$request->filled('username')) {
      return false;
    }

    $user = null;

    // Try NIS authentication (for siswa)
    if ($request->filled('nis')) {
      // Try with exact NIS first
      $student = Student::where('nis', $request->nis)->first();

      // If not found, try padding with zeros (in case user entered 2025001 instead of 2025000001)
      if (!$student && strlen($request->nis) < 10) {
        $paddedNis = str_pad($request->nis, 10, '0', STR_PAD_RIGHT);
        $student = Student::where('nis', $paddedNis)->first();
      }

      if ($student && $student->user && $student->user->role === User::ROLE_SISWA) {
        $user = $student->user;
      }
    }
    // Try username authentication (for guru/admin/orangtua)
    else if ($request->filled('username')) {
      $user = User::where('username', $request->username)
        ->whereIn('role', [User::ROLE_ADMIN, User::ROLE_GURU, User::ROLE_ORANGTUA])
        ->first();
    }

    // Verify password
    if ($user && Hash::check($request->password, $user->password)) {
      Auth::login($user, $request->boolean('remember'));
      return true;
    }

    return false;
  }

  /**
   * Determine if the request has been rate limited.
   */
  protected function isRateLimited(Request $request): bool
  {
    return RateLimiter::tooManyAttempts(
      $this->throttleKey($request),
      5
    );
  }

  /**
   * Get the rate limiting throttle key for the request.
   */
  protected function throttleKey(Request $request): string
  {
    $identifier = $request->input('nis') ?: $request->input('username');
    return Str::transliterate(Str::lower($identifier) . '|' . $request->ip());
  }

  /**
   * Determine if the user has too many failed login attempts.
   */
  protected function sendLockoutResponse(Request $request)
  {
    $seconds = RateLimiter::availableIn($this->throttleKey($request));

    return back()->withErrors([
      'login_error' => trans('auth.throttle', ['seconds' => $seconds]),
    ]);
  }

  /**
   * Fire the lockout event.
   */
  protected function fireLockoutEvent(Request $request): void
  {
    event(new Lockout($request));
  }
}

<?php

use App\Http\Controllers\Auth\LoginController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Laravel\Fortify\Http\Controllers\AuthenticatedSessionController;
use Laravel\Fortify\Http\Controllers\ConfirmablePasswordController;
use Laravel\Fortify\Http\Controllers\ConfirmedPasswordStatusController;
use Laravel\Fortify\Http\Controllers\ConfirmPasswordController;
use Laravel\Fortify\Http\Controllers\EmailVerificationNotificationController;
use Laravel\Fortify\Http\Controllers\EmailVerificationPromptController;
use Laravel\Fortify\Http\Controllers\ForgotPasswordController;
use Laravel\Fortify\Http\Controllers\NewPasswordController;
use Laravel\Fortify\Http\Controllers\PasswordController;
use Laravel\Fortify\Http\Controllers\ProfileInformationController;
use Laravel\Fortify\Http\Controllers\RegisteredUserController;
use Laravel\Fortify\Http\Controllers\TwoFactorAuthenticationController;
use Laravel\Fortify\Http\Controllers\TwoFactorQrCodeController;
use Laravel\Fortify\Http\Controllers\TwoFactorRecoveryCodeController;
use Laravel\Fortify\Http\Controllers\VerifyEmailController;

Route::group(['middleware' => config('fortify.middleware', ['web'])], function () {
  // Authentication Routes - Use custom LoginController
  $limiter = config('fortify.limiters.login');
  $twoFactorLimiter = config('fortify.limiters.two-factor');
  $verificationLimiter = config('fortify.limiters.verification', '6,1');

  Route::post('/login', [LoginController::class, 'store'])
    ->middleware(array_filter([$limiter ? 'throttle:' . $limiter : null]))
    ->name('login.store');

  Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->name('logout');
});

<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\UpdateSessionActivity::class,
        ]);

        $middleware->alias([
            'role' => \App\Http\Middleware\EnsureRole::class,
            'approved' => \App\Http\Middleware\EnsureApproved::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (ValidationException $e, $request) {
            if (! $request->isMethod('POST') || $request->path() !== 'login') {
                return null;
            }
            $messages = $e->validator->errors()->getMessages();
            $otpRequired = isset($messages['otp']) && in_array('OTP required', $messages['otp'], true);
            if ($otpRequired || $request->session()->get('login.requires_otp')) {
                $url = route('otp-verification.show');

                return $request->header('X-Inertia')
                    ? Inertia::location($url)
                    : redirect()->to($url, 303);
            }

            return null;
        });
    })->create();

<?php

namespace App\Http\Responses;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;

class RegisterResponse implements RegisterResponseContract
{
    public function toResponse($request): RedirectResponse
    {
        /** @var Request $request */
        $user = $request->user();

        if ($user) {
            Session::put('registration.user_id', $user->id);
        }

        Auth::logout();

        return redirect()->route('registration-otp.show');
    }
}

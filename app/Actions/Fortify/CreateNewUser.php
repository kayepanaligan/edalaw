<?php

namespace App\Actions\Fortify;

use App\ApprovalStatus;
use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ])->validate();

        $visitorRole = Role::where('slug', 'visitor')->first();

        $user = User::create([
            'first_name' => $input['first_name'],
            'middle_name' => $input['middle_name'] ?? null,
            'last_name' => $input['last_name'],
            'email' => $input['email'],
            'password' => $input['password'],
            'dob' => $input['dob'],
            'gender' => $input['gender'],
            'street' => $input['street'],
            'brgy' => $input['brgy'],
            'municipality' => $input['municipality'],
            'province' => $input['province'],
            'postal_code' => $input['postal_code'],
            'role_id' => $visitorRole->id,
            'approval_status' => ApprovalStatus::Pending,
        ]);

        // Notify super admins about new user registration
        \App\Services\NotificationService::notifySuperAdminsAboutNewUser($user);

        return $user;
    }
}

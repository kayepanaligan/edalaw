<?php

namespace App\Actions\Fortify;

use App\ApprovalStatus;
use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\Role;
use App\Models\User;
use App\Services\OtpService;
use App\Services\RecaptchaService;
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
        // Verify reCAPTCHA token
        if (isset($input['recaptcha_token'])) {
            $recaptchaResult = RecaptchaService::verify($input['recaptcha_token'], 'register', 0.5);
            if (! $recaptchaResult || ! $recaptchaResult['success']) {
                Validator::make([], [
                    'recaptcha' => 'required',
                ])->after(function ($validator) {
                    $validator->errors()->add('recaptcha', 'reCAPTCHA verification failed. Please try again.');
                })->validate();
            }
        }

        $request = request();

        // Validate role_id
        $role = Role::find($input['role_id'] ?? null);
        if (! $role || ! in_array($role->slug, ['visitor', 'bjmp_officer', 'monitoring_officer'], true)) {
            Validator::make([], [
                'role_id' => 'required',
            ])->after(function ($validator) {
                $validator->errors()->add('role_id', 'Please select a valid account type.');
            })->validate();
        }

        // Validate ID documents for visitors
        if ($role->slug === 'visitor') {
            Validator::make($request->all(), [
                'id_document_1' => ['required', 'file', 'mimes:jpeg,jpg,png,pdf', 'max:5120'], // 5MB
                'id_document_2' => ['required', 'file', 'mimes:jpeg,jpg,png,pdf', 'max:5120'],
            ])->validate();
        }

        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'role_id' => ['required', 'exists:roles,id'],
        ])->validate();

        // Store ID documents for visitors
        $idDocument1Path = null;
        $idDocument2Path = null;

        if ($role->slug === 'visitor' && $request->hasFile('id_document_1') && $request->hasFile('id_document_2')) {
            $idDocument1Path = $request->file('id_document_1')->store('users/id_documents', 'public');
            $idDocument2Path = $request->file('id_document_2')->store('users/id_documents', 'public');
        }

        $user = User::create([
            'first_name' => $input['first_name'],
            'middle_name' => $input['middle_name'] ?? null,
            'last_name' => $input['last_name'],
            'email' => $input['email'],
            'contact_number' => $input['contact_number'] ?? null,
            'password' => $input['password'],
            'dob' => $input['dob'],
            'gender' => $input['gender'],
            'street' => $input['street'],
            'brgy' => $input['brgy'],
            'municipality' => $input['municipality'],
            'province' => $input['province'],
            'postal_code' => $input['postal_code'],
            'role_id' => $role->id,
            'approval_status' => ApprovalStatus::Pending,
            'id_document_1_path' => $idDocument1Path,
            'id_document_2_path' => $idDocument2Path,
        ]);

        // Send OTP to email and SMS for verification
        $otpService = new OtpService;

        // Send OTP to SMS
        if ($user->contact_number) {
            $otpService->generateAndSend($user, 'phone_verification');
        }

        // Send OTP to email
        $otpService->generateAndSend($user, 'email_verification');

        // Notify super admins about new user registration
        \App\Services\NotificationService::notifySuperAdminsAboutNewUser($user);

        return $user;
    }
}

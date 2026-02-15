<?php

namespace App\Http\Requests\VisitSession;

use Illuminate\Foundation\Http\FormRequest;

class FlagChatMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        $session = $this->route('session');

        return $session->monitor_id === $this->user()?->id
            || $this->user()?->role?->slug === 'super_admin';
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'flag_reason' => ['required', 'string', 'max:500'],
        ];
    }
}

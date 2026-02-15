<?php

namespace App\Http\Requests\VisitSession;

use Illuminate\Foundation\Http\FormRequest;

class SendChatMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        $session = $this->route('session');
        $visitor = $session->visit?->user ?? $session->eburol?->user;

        return $visitor && $visitor->id === $this->user()?->id;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'message' => ['required', 'string', 'max:2000'],
        ];
    }
}

<?php

namespace App\Exceptions;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;

class ConcurrentLoginAttemptException extends Exception
{
    public function __construct(
        public User $user,
        public Request $request
    ) {
        parent::__construct('Concurrent login attempt detected.');
    }
}

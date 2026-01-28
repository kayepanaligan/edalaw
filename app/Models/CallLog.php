<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CallLog extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'phone_number',
        'call_type',
        'call_date',
        'duration',
        'notes',
        'status',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'call_date' => 'datetime',
        ];
    }

    /**
     * Get the user that owns the call log.
     *
     * @return BelongsTo<User, CallLog>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

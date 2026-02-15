<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class InmateTunnel extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'visit_session_id',
        'tunnel_token',
        'expires_at',
        'is_used',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'is_used' => 'boolean',
        ];
    }

    public function visitSession(): BelongsTo
    {
        return $this->belongsTo(VisitSession::class);
    }

    public function isValid(): bool
    {
        return ! $this->is_used && $this->expires_at->isFuture();
    }

    public static function generateToken(): string
    {
        return Str::uuid()->toString();
    }
}

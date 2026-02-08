<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MonitoringAlert extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'monitoring_session_id',
        'alert_type',
        'priority',
        'title',
        'message',
        'metadata',
        'is_read',
        'read_by',
        'read_at',
        'escalated_to_admin',
        'escalated_by',
        'escalated_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'metadata' => 'array',
            'is_read' => 'boolean',
            'read_at' => 'datetime',
            'escalated_to_admin' => 'boolean',
            'escalated_at' => 'datetime',
        ];
    }

    /**
     * Get the monitoring session for this alert.
     *
     * @return BelongsTo<MonitoringSession, MonitoringAlert>
     */
    public function monitoringSession(): BelongsTo
    {
        return $this->belongsTo(MonitoringSession::class);
    }

    /**
     * Get the user who read this alert.
     *
     * @return BelongsTo<User, MonitoringAlert>
     */
    public function readBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'read_by');
    }

    /**
     * Get the user who escalated this alert.
     *
     * @return BelongsTo<User, MonitoringAlert>
     */
    public function escalatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'escalated_by');
    }
}

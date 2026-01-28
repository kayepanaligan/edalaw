<?php

namespace App\Models;

use App\VisitStatus;
use App\VisitType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Visit extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'scheduled_date',
        'scheduled_time',
        'visit_type',
        'inmate_first_name',
        'inmate_middle_name',
        'inmate_last_name',
        'status',
        'notes',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'scheduled_date' => 'date',
            'visit_type' => VisitType::class,
            'status' => VisitStatus::class,
        ];
    }

    /**
     * Get the user that owns the visit.
     *
     * @return BelongsTo<User, Visit>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

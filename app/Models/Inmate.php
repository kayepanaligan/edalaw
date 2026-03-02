<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Inmate extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'cell_id',
        'first_name',
        'middle_name',
        'last_name',
        'inmate_number',
        'date_of_birth',
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
            'date_of_birth' => 'date',
        ];
    }

    /**
     * Get the cell this inmate belongs to.
     *
     * @return BelongsTo<Cell, Inmate>
     */
    public function cell(): BelongsTo
    {
        return $this->belongsTo(Cell::class);
    }

    /**
     * Scope a query to only include active inmates.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to filter by cell.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param int $cellId
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByCell($query, int $cellId)
    {
        return $query->where('cell_id', $cellId);
    }

    /**
     * Get the full name of the inmate.
     */
    public function getFullNameAttribute(): string
    {
        $name = $this->first_name;
        if ($this->middle_name) {
            $name .= ' ' . $this->middle_name;
        }
        $name .= ' ' . $this->last_name;

        return $name;
    }
}

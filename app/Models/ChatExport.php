<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ChatExport extends Model
{
    protected $fillable = [
        'visit_session_id',
        'file_path',
        'format',
        'generated_by',
    ];

    public function visitSession(): BelongsTo
    {
        return $this->belongsTo(VisitSession::class);
    }

    public function generatedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generated_by');
    }

    public function getDownloadUrl(string $disk = 's3'): ?string
    {
        return Storage::disk($disk)->exists($this->file_path)
            ? Storage::disk($disk)->temporaryUrl($this->file_path, now()->addMinutes(30))
            : null;
    }
}

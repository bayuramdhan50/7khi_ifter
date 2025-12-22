<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GemarBelajarDetail extends Model
{
    protected $fillable = [
        'submission_id',
        'gemar_belajar',
        'ekstrakurikuler',
        'bimbingan_belajar',
        'mengerjakan_tugas',
        'lainnya',
    ];

    protected $casts = [
        'gemar_belajar' => 'boolean',
        'ekstrakurikuler' => 'boolean',
        'bimbingan_belajar' => 'boolean',
        'mengerjakan_tugas' => 'boolean',
        'lainnya' => 'boolean',
    ];

    public function submission(): BelongsTo
    {
        return $this->belongsTo(ActivitySubmission::class, 'submission_id');
    }
}

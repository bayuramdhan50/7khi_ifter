<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GemarBelajarDetail extends Model
{
    protected $fillable = [
        'submission_id',
        'subject',
        'study_time',
        'study_duration',
        'study_type',
    ];

    protected $casts = [
        'study_time' => 'datetime:H:i',
        'study_duration' => 'integer',
    ];

    public function submission(): BelongsTo
    {
        return $this->belongsTo(ActivitySubmission::class, 'submission_id');
    }
}

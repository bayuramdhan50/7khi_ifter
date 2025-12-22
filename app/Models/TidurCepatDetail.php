<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TidurCepatDetail extends Model
{
    protected $fillable = [
        'submission_id',
        'sleep_time',
    ];

    protected $casts = [
        'sleep_time' => 'datetime:H:i',
    ];

    public function submission(): BelongsTo
    {
        return $this->belongsTo(ActivitySubmission::class, 'submission_id');
    }
}

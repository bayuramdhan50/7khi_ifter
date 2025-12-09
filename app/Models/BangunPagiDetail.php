<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BangunPagiDetail extends Model
{
    protected $fillable = [
        'submission_id',
        'wake_up_time',
        'tidy_bed',
        'open_window',
        'morning_prayer',
        'tidy_room',
        'sleep_duration',
    ];

    protected $casts = [
        'wake_up_time' => 'datetime:H:i',
        'tidy_bed' => 'boolean',
        'open_window' => 'boolean',
        'morning_prayer' => 'boolean',
        'tidy_room' => 'boolean',
        'sleep_duration' => 'integer',
    ];

    public function submission(): BelongsTo
    {
        return $this->belongsTo(ActivitySubmission::class, 'submission_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TidurCepatDetail extends Model
{
    protected $fillable = [
        'submission_id',
        'sleep_time',
        'brush_teeth',
        'wash_face',
        'change_clothes',
        'prayer_before_sleep',
        'turn_off_gadget',
        'tidy_bed_before_sleep',
    ];

    protected $casts = [
        'sleep_time' => 'datetime:H:i',
        'brush_teeth' => 'boolean',
        'wash_face' => 'boolean',
        'change_clothes' => 'boolean',
        'prayer_before_sleep' => 'boolean',
        'turn_off_gadget' => 'boolean',
        'tidy_bed_before_sleep' => 'boolean',
    ];

    public function submission(): BelongsTo
    {
        return $this->belongsTo(ActivitySubmission::class, 'submission_id');
    }
}

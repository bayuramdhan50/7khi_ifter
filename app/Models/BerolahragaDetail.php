<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BerolahragaDetail extends Model
{
    protected $fillable = [
        'submission_id',
        'exercise_type',
        'exercise_time',
        'exercise_duration',
        'repetition',
    ];

    protected $casts = [
        'exercise_time' => 'datetime:H:i',
        'exercise_duration' => 'integer',
        'repetition' => 'integer',
    ];

    public function submission(): BelongsTo
    {
        return $this->belongsTo(ActivitySubmission::class, 'submission_id');
    }
}

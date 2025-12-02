<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProgressTracking extends Model
{
    protected $table = 'progress_tracking';

    protected $fillable = [
        'student_id',
        'activity_id',
        'total_target',
        'total_completed',
        'completion_percentage',
        'last_updated_at',
    ];

    protected $casts = [
        'total_target' => 'integer',
        'total_completed' => 'integer',
        'completion_percentage' => 'decimal:2',
        'last_updated_at' => 'datetime',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class);
    }
}

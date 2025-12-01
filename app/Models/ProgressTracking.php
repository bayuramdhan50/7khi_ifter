<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProgressTracking extends Model
{
    protected $table = 'progress_tracking';

    protected $fillable = [
        'student_id',
        'month',
        'year',
        'total_submissions',
        'approved_submissions',
        'rejected_submissions',
        'pending_submissions',
        'percentage',
        'rating',
    ];

    protected $casts = [
        'percentage' => 'decimal:2',
        'rating' => 'decimal:2',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}

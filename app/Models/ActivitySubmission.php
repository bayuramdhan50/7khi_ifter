<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivitySubmission extends Model
{
    protected $fillable = [
        'activity_detail_id',
        'student_id',
        'value',
        'submitted_at',
        'verified_at',
        'verified_by',
    ];

    protected $casts = [
        'value' => 'integer',
        'submitted_at' => 'datetime',
        'verified_at' => 'datetime',
    ];

    public function activityDetail(): BelongsTo
    {
        return $this->belongsTo(ActivityDetail::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}

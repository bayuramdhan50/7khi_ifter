<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MakanSehatDetail extends Model
{
    protected $fillable = [
        'submission_id',
        'karbohidrat',
        'protein',
        'sayur',
        'buah',
    ];

    protected $casts = [
        // Remove boolean casts to allow string values
    ];

    public function submission(): BelongsTo
    {
        return $this->belongsTo(ActivitySubmission::class, 'submission_id');
    }
}

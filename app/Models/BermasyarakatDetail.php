<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BermasyarakatDetail extends Model
{
    protected $fillable = [
        'submission_id',
        'tarka',
        'kerja_bakti',
        'gotong_royong',
        'lainnya',
    ];

    protected $casts = [
        'tarka' => 'boolean',
        'kerja_bakti' => 'boolean',
        'gotong_royong' => 'boolean',
        'lainnya' => 'boolean',
    ];

    public function submission(): BelongsTo
    {
        return $this->belongsTo(ActivitySubmission::class, 'submission_id');
    }
}

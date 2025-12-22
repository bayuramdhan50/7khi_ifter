<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BangunPagiDetail extends Model
{
    protected $fillable = [
        'submission_id',
        'jam_bangun',
        'membereskan_tempat_tidur',
        'mandi',
        'berpakaian_rapi',
        'sarapan',
    ];

    protected $casts = [
        'jam_bangun' => 'datetime:H:i',
        'membereskan_tempat_tidur' => 'boolean',
        'mandi' => 'boolean',
        'berpakaian_rapi' => 'boolean',
        'sarapan' => 'boolean',
    ];

    public function submission(): BelongsTo
    {
        return $this->belongsTo(ActivitySubmission::class, 'submission_id');
    }
}

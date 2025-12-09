<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BeribadahDetail extends Model
{
    protected $fillable = [
        'submission_id',
        // Muslim
        'subuh',
        'dzuhur',
        'ashar',
        'maghrib',
        'isya',
        'mengaji',
        'berdoa',
        'bersedekah',
        'lainnya',
        // Non-Muslim
        'doa_pagi',
        'baca_firman',
        'renungan',
        'doa_malam',
        'ibadah_bersama',
    ];

    protected $casts = [
        'subuh' => 'boolean',
        'dzuhur' => 'boolean',
        'ashar' => 'boolean',
        'maghrib' => 'boolean',
        'isya' => 'boolean',
        'mengaji' => 'boolean',
        'berdoa' => 'boolean',
        'bersedekah' => 'boolean',
        'lainnya' => 'boolean',
        'doa_pagi' => 'boolean',
        'baca_firman' => 'boolean',
        'renungan' => 'boolean',
        'doa_malam' => 'boolean',
        'ibadah_bersama' => 'boolean',
    ];

    public function submission(): BelongsTo
    {
        return $this->belongsTo(ActivitySubmission::class, 'submission_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ActivityDetail extends Model
{
    protected $fillable = [
        'activity_id',
        'title',
        'description',
        'target_type',
        'target_value',
        'order',
    ];

    protected $casts = [
        'target_value' => 'integer',
        'order' => 'integer',
    ];

    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class);
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(ActivitySubmission::class);
    }
}

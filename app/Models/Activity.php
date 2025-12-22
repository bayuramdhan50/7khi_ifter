<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Activity extends Model
{
    protected $fillable = [
        'title',
        'icon',
        'color',
        'order',
    ];

    public function submissions(): HasMany
    {
        return $this->hasMany(ActivitySubmission::class);
    }
}

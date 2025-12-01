<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Student extends Model
{
    protected $fillable = [
        'user_id',
        'nis',
        'nisn',
        'class_id',
        'gender',
        'date_of_birth',
        'religion',
        'address',
        'photo',
        'is_active',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'is_active' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function class(): BelongsTo
    {
        return $this->belongsTo(ClassModel::class, 'class_id');
    }

    public function parents(): BelongsToMany
    {
        return $this->belongsToMany(ParentModel::class, 'parent_student', 'student_id', 'parent_id')
            ->withPivot('relationship', 'is_primary')
            ->withTimestamps();
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(ActivitySubmission::class);
    }

    public function biodata(): HasOne
    {
        return $this->hasOne(BiodataSiswa::class);
    }

    public function progressTracking(): HasMany
    {
        return $this->hasMany(ProgressTracking::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ActivitySubmission extends Model
{
    protected $fillable = [
        'student_id',
        'activity_id',
        'date',
        'time',
        'photo',
        'notes',
        'status',
        'approved_by',
        'approved_at',
        'rejection_reason',
    ];

    protected $casts = [
        'date' => 'date',
        'approved_at' => 'datetime',
    ];

    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(ParentModel::class, 'approved_by');
    }


    // New relationships for separate detail tables
    public function bangunPagiDetail()
    {
        return $this->hasOne(BangunPagiDetail::class, 'submission_id');
    }

    public function berolahragaDetail()
    {
        return $this->hasOne(BerolahragaDetail::class, 'submission_id');
    }

    public function beribadahDetail()
    {
        return $this->hasOne(BeribadahDetail::class, 'submission_id');
    }

    public function gemarBelajarDetail()
    {
        return $this->hasOne(GemarBelajarDetail::class, 'submission_id');
    }

    public function makanSehatDetail()
    {
        return $this->hasOne(MakanSehatDetail::class, 'submission_id');
    }

    public function bermasyarakatDetail()
    {
        return $this->hasOne(BermasyarakatDetail::class, 'submission_id');
    }

    public function tidurCepatDetail()
    {
        return $this->hasOne(TidurCepatDetail::class, 'submission_id');
    }
}

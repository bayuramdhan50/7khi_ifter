<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BiodataSiswa extends Model
{
    protected $table = 'biodata_siswa';

    protected $fillable = [
        'student_id',
        'full_name',
        'nickname',
        'birth_place',
        'birth_date',
        'gender',
        'address',
        'phone',
        'email',
        'blood_type',
        'religion',
        'nationality',
        'photo',
    ];

    protected $casts = [
        'birth_date' => 'date',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}

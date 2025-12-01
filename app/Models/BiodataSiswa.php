<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BiodataSiswa extends Model
{
    protected $table = 'biodata_siswa';

    protected $fillable = [
        'student_id',
        'hobi',
        'cita_cita',
        'makanan_kesukaan',
        'minuman_kesukaan',
        'hewan_kesukaan',
        'sesuatu_tidak_suka',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}

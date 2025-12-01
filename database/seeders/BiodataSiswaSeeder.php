<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BiodataSiswaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $biodatas = [
            [
                'student_id' => 1, // Ahmad Rizky
                'hobi' => 'Bermain sepak bola, membaca komik',
                'cita_cita' => 'Pemain Sepak Bola Profesional',
                'makanan_kesukaan' => 'Nasi Goreng',
                'minuman_kesukaan' => 'Jus Mangga',
                'hewan_kesukaan' => 'Kucing',
                'sesuatu_tidak_suka' => 'Bangun pagi terlalu cepat',
            ],
            [
                'student_id' => 2, // Budi Santoso
                'hobi' => 'Bermain game, coding',
                'cita_cita' => 'Programmer',
                'makanan_kesukaan' => 'Mie Ayam',
                'minuman_kesukaan' => 'Es Teh Manis',
                'hewan_kesukaan' => 'Anjing',
                'sesuatu_tidak_suka' => 'Pelajaran yang terlalu sulit',
            ],
            [
                'student_id' => 3, // Citra Dewi
                'hobi' => 'Menyanyi, menggambar',
                'cita_cita' => 'Penyanyi',
                'makanan_kesukaan' => 'Soto Ayam',
                'minuman_kesukaan' => 'Susu Coklat',
                'hewan_kesukaan' => 'Kelinci',
                'sesuatu_tidak_suka' => 'Suara bising',
            ],
        ];

        foreach ($biodatas as $biodata) {
            \App\Models\BiodataSiswa::create($biodata);
        }
    }
}

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
        $students = \App\Models\Student::all();
        
        $hobbies = ['Membaca', 'Bermain Bola', 'Menggambar', 'Bernyanyi', 'Bermain Game'];
        $citaCita = ['Dokter', 'Guru', 'Polisi', 'Pilot', 'Insinyur', 'Programmer'];
        $makanan = ['Nasi Goreng', 'Mie Ayam', 'Bakso', 'Sate', 'Rendang'];
        $minuman = ['Teh Manis', 'Jus Jeruk', 'Susu', 'Air Mineral', 'Jus Mangga'];
        $hewan = ['Kucing', 'Anjing', 'Burung', 'Kelinci', 'Ikan'];
        $tidakSuka = ['Sayur pahit', 'Serangga', 'Ketinggian', 'Gelap', 'Berisik'];

        foreach ($students as $student) {
            \App\Models\BiodataSiswa::create([
                'student_id' => $student->id,
                'hobi' => $hobbies[array_rand($hobbies)],
                'cita_cita' => $citaCita[array_rand($citaCita)],
                'makanan_kesukaan' => $makanan[array_rand($makanan)],
                'minuman_kesukaan' => $minuman[array_rand($minuman)],
                'hewan_kesukaan' => $hewan[array_rand($hewan)],
                'sesuatu_tidak_suka' => $tidakSuka[array_rand($tidakSuka)],
            ]);
        }
    }
}

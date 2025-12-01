<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed users with religion data
        $this->call(UserSeeder::class);

        // Seed activities (7 kebiasaan baik)
        $this->call(ActivitySeeder::class);

        // Seed classes (kelas-kelas)
        $this->call(ClassSeeder::class);

        // Seed teachers (guru-guru)
        $this->call(TeacherSeeder::class);

        // Seed parents (orang tua)
        $this->call(ParentSeeder::class);

        // Seed students (siswa) + relasi parent-student
        $this->call(StudentSeeder::class);

        // Seed biodata siswa
        $this->call(BiodataSiswaSeeder::class);

        // Seed activity submissions (pengumpulan kegiatan) + details
        $this->call(ActivitySubmissionSeeder::class);
    }
}

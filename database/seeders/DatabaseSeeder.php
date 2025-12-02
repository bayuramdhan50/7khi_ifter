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
        // 1. Seed users first (admin, guru, orangtua, siswa)
        $this->call(UserSeeder::class);

        // 2. Seed activities (7 kebiasaan)
        $this->call(ActivitySeeder::class);

        // 3. Seed classes
        $this->call(ClassSeeder::class);

        // 4. Seed teachers
        $this->call(TeacherSeeder::class);

        // 5. Seed students
        $this->call(StudentSeeder::class);

        // 6. Seed parents and attach to students
        $this->call(ParentSeeder::class);

        // 7. Seed biodata siswa
        $this->call(BiodataSiswaSeeder::class);

        // 8. Seed activity submissions (data dummy untuk 15 hari terakhir)
        $this->call(ActivitySubmissionSeeder::class);
    }
}

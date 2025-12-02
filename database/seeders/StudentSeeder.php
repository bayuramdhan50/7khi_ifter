<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get users with role siswa
        $siswaUsers = \App\Models\User::where('role', 'siswa')->get();
        
        $students = [
            [
                'user_id' => $siswaUsers[0]->id ?? 4, // Siswa Muslim
                'nis' => '2025001',
                'nisn' => '0012345678',
                'class_id' => 1, // 1A
                'gender' => 'L',
                'date_of_birth' => '2013-05-15',
                'religion' => 'Islam',
                'address' => 'Jl. Merdeka No. 123, Bandung',
            ],
            [
                'user_id' => $siswaUsers[1]->id ?? 5, // Siswa Kristen
                'nis' => '2025002',
                'nisn' => '0012345679',
                'class_id' => 1, // 1A
                'gender' => 'P',
                'date_of_birth' => '2013-08-20',
                'religion' => 'Kristen',
                'address' => 'Jl. Sudirman No. 456, Bandung',
            ],
            [
                'user_id' => $siswaUsers[2]->id ?? 6, // Siswa Katolik
                'nis' => '2025003',
                'nisn' => '0012345680',
                'class_id' => 2, // 1B
                'gender' => 'L',
                'date_of_birth' => '2013-03-10',
                'religion' => 'Katolik',
                'address' => 'Jl. Asia Afrika No. 789, Bandung',
            ],
            [
                'user_id' => $siswaUsers[3]->id ?? 7, // Siswa Hindu
                'nis' => '2025004',
                'nisn' => '0012345681',
                'class_id' => 3, // 2A
                'gender' => 'P',
                'date_of_birth' => '2012-11-25',
                'religion' => 'Hindu',
                'address' => 'Jl. Dago No. 321, Bandung',
            ],
            [
                'user_id' => $siswaUsers[4]->id ?? 8, // Siswa Buddha
                'nis' => '2025005',
                'nisn' => '0012345682',
                'class_id' => 3, // 2A
                'gender' => 'L',
                'date_of_birth' => '2012-07-18',
                'religion' => 'Buddha',
                'address' => 'Jl. Setiabudhi No. 654, Bandung',
            ],
        ];

        foreach ($students as $student) {
            \App\Models\Student::create($student);
        }
    }
}

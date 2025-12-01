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
        $students = [
            [
                'user' => ['name' => 'Ahmad Rizky', 'email' => 'ahmad.rizky@student.smpn37.sch.id', 'password' => bcrypt('password'), 'role' => 'siswa'],
                'nis' => '2025001',
                'nisn' => '0071234567',
                'class_id' => 1, // 7A
                'gender' => 'L',
                'date_of_birth' => '2011-05-15',
                'religion' => 'Islam',
            ],
            [
                'user' => ['name' => 'Budi Santoso', 'email' => 'budi.santoso@student.smpn37.sch.id', 'password' => bcrypt('password'), 'role' => 'siswa'],
                'nis' => '2025002',
                'nisn' => '0071234568',
                'class_id' => 1, // 7A
                'gender' => 'L',
                'date_of_birth' => '2011-08-20',
                'religion' => 'Islam',
            ],
            [
                'user' => ['name' => 'Citra Dewi', 'email' => 'citra.dewi@student.smpn37.sch.id', 'password' => bcrypt('password'), 'role' => 'siswa'],
                'nis' => '2025003',
                'nisn' => '0071234569',
                'class_id' => 2, // 7B
                'gender' => 'P',
                'date_of_birth' => '2011-03-10',
                'religion' => 'Kristen',
            ],
        ];

        foreach ($students as $index => $studentData) {
            $user = \App\Models\User::create($studentData['user']);
            $student = \App\Models\Student::create([
                'user_id' => $user->id,
                'nis' => $studentData['nis'],
                'nisn' => $studentData['nisn'],
                'class_id' => $studentData['class_id'],
                'gender' => $studentData['gender'],
                'date_of_birth' => $studentData['date_of_birth'],
                'religion' => $studentData['religion'],
                'address' => 'Bandung, Jawa Barat',
                'is_active' => true,
            ]);

            // Hubungkan dengan orang tua (2 orang tua per anak)
            $parentStartIndex = $index * 2;
            $parents = \App\Models\ParentModel::skip($parentStartIndex)->take(2)->get();
            
            if ($parents->count() >= 2) {
                // Ayah (primary)
                $student->parents()->attach($parents[0]->id, [
                    'relationship' => 'ayah',
                    'is_primary' => true,
                ]);
                
                // Ibu
                $student->parents()->attach($parents[1]->id, [
                    'relationship' => 'ibu',
                    'is_primary' => false,
                ]);
            }
        }
    }
}

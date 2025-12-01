<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TeacherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teachers = [
            [
                'user' => ['name' => 'Pak Budi Santoso', 'email' => 'budi.guru@smpn37.sch.id', 'password' => bcrypt('password'), 'role' => 'guru'],
                'nip' => '198501012010011001',
                'phone' => '081234567801',
            ],
            [
                'user' => ['name' => 'Bu Siti Nurhaliza', 'email' => 'siti.guru@smpn37.sch.id', 'password' => bcrypt('password'), 'role' => 'guru'],
                'nip' => '198702022011012001',
                'phone' => '081234567802',
            ],
            [
                'user' => ['name' => 'Pak Ahmad Dahlan', 'email' => 'ahmad.guru@smpn37.sch.id', 'password' => bcrypt('password'), 'role' => 'guru'],
                'nip' => '198903032012011002',
                'phone' => '081234567803',
            ],
        ];

        foreach ($teachers as $teacherData) {
            $user = \App\Models\User::create($teacherData['user']);
            \App\Models\Teacher::create([
                'user_id' => $user->id,
                'nip' => $teacherData['nip'],
                'phone' => $teacherData['phone'],
                'address' => 'Bandung, Jawa Barat',
                'is_active' => true,
            ]);
        }

        // Update kelas dengan wali kelas
        $classes = \App\Models\ClassModel::all();
        $teachers = \App\Models\Teacher::all();
        
        if ($classes->count() > 0 && $teachers->count() > 0) {
            $classes[0]->update(['teacher_id' => $teachers[0]->user_id]); // 7A
            $classes[1]->update(['teacher_id' => $teachers[1]->user_id]); // 7B
            $classes[3]->update(['teacher_id' => $teachers[2]->user_id]); // 8A
        }
    }
}

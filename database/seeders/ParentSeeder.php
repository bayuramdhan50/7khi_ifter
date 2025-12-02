<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ParentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get user orangtua
        $orangtuaUser = \App\Models\User::where('role', 'orangtua')->first();
        
        if ($orangtuaUser) {
            // Create parent
            $parent = \App\Models\ParentModel::create([
                'user_id' => $orangtuaUser->id,
                'phone' => '081234567890',
                'address' => 'Jl. Keluarga No. 111, Bandung',
                'occupation' => 'Wiraswasta',
            ]);

            // Attach students to parent (3 anak)
            $students = \App\Models\Student::limit(3)->get();
            
            foreach ($students as $index => $student) {
                \DB::table('parent_student')->insert([
                    'parent_id' => $parent->id,
                    'student_id' => $student->id,
                    'relationship' => $index === 0 ? 'ayah' : ($index === 1 ? 'ibu' : 'wali'),
                    'is_primary' => $index === 0, // Ayah sebagai primary
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Create more parents
        $moreParents = [
            [
                'name' => 'Budi Santoso',
                'email' => 'budi.parent@ifter.com',
                'password' => \Hash::make('password'),
                'role' => 'orangtua',
                'phone' => '081234567891',
                'address' => 'Jl. Sejahtera No. 222, Bandung',
                'occupation' => 'PNS',
            ],
            [
                'name' => 'Siti Rahayu',
                'email' => 'siti.parent@ifter.com',
                'password' => \Hash::make('password'),
                'role' => 'orangtua',
                'phone' => '081234567892',
                'address' => 'Jl. Makmur No. 333, Bandung',
                'occupation' => 'Guru',
            ],
        ];

        foreach ($moreParents as $parentData) {
            // Create user
            $user = \App\Models\User::create([
                'name' => $parentData['name'],
                'email' => $parentData['email'],
                'password' => $parentData['password'],
                'role' => $parentData['role'],
            ]);

            // Create parent
            $parent = \App\Models\ParentModel::create([
                'user_id' => $user->id,
                'phone' => $parentData['phone'],
                'address' => $parentData['address'],
                'occupation' => $parentData['occupation'],
            ]);
        }
    }
}

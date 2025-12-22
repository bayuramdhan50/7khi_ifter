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
        // Get guru user
        $guruUser = \App\Models\User::where('role', 'guru')->first();

        if ($guruUser) {
            \App\Models\Teacher::create([
                'user_id' => $guruUser->id,
                'nip' => '197801012005011001',
                'phone' => '081234567893',
                'address' => 'Jl. Pendidikan No. 444, Bandung',
            ]);
        }

        // Create more teachers
        $moreTeachers = [
            [
                'name' => 'Ibu Dewi',
                'username' => 'dewiguru',
                'nip' => '198205152008012002',
                'phone' => '081234567894',
            ],
            [
                'name' => 'Pak Andi',
                'username' => 'andiguru',
                'nip' => '198912202010011003',
                'phone' => '081234567895',
            ],
        ];

        foreach ($moreTeachers as $teacherData) {
            $user = \App\Models\User::create([
                'name' => $teacherData['name'],
                'username' => $teacherData['username'],
                'password' => \Hash::make('password'),
                'role' => 'guru',
            ]);

            \App\Models\Teacher::create([
                'user_id' => $user->id,
                'nip' => $teacherData['nip'],
                'phone' => $teacherData['phone'],
                'address' => 'Jl. Guru No. 555, Bandung',
            ]);
        }
    }
}

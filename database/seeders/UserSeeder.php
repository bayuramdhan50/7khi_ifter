<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin
        User::create([
            'name' => 'Admin',
            'username' => 'admin',
            'password' => Hash::make('password'),
            'role' => User::ROLE_ADMIN,
            'religion' => 'muslim',
        ]);

        // Guru
        User::create([
            'name' => 'Guru Test',
            'username' => 'gurutest',
            'password' => Hash::make('password'),
            'role' => User::ROLE_GURU,
            'religion' => 'muslim',
        ]);

        // Orangtua
        User::create([
            'name' => 'Orangtua Test',
            'username' => 'orangtuatest',
            'password' => Hash::make('password'),
            'role' => User::ROLE_ORANGTUA,
            'religion' => 'muslim',
        ]);

        // Siswa Muslim
        User::create([
            'name' => 'Siswa Muslim',
            'username' => 'siswamuslim',
            'password' => Hash::make('password'),
            'role' => User::ROLE_SISWA,
            'religion' => 'muslim',
        ]);

        // Siswa Non-Muslim (Kristen)
        User::create([
            'name' => 'Siswa Kristen',
            'username' => 'siswakristen',
            'password' => Hash::make('password'),
            'role' => User::ROLE_SISWA,
            'religion' => 'kristen',
        ]);

        // Siswa Non-Muslim (Katolik)
        User::create([
            'name' => 'Siswa Katolik',
            'username' => 'siswakatoli',
            'password' => Hash::make('password'),
            'role' => User::ROLE_SISWA,
            'religion' => 'katolik',
        ]);

        // Siswa Non-Muslim (Hindu)
        User::create([
            'name' => 'Siswa Hindu',
            'username' => 'siswahindu',
            'password' => Hash::make('password'),
            'role' => User::ROLE_SISWA,
            'religion' => 'hindu',
        ]);

        // Siswa Non-Muslim (Buddha)
        User::create([
            'name' => 'Siswa Buddha',
            'username' => 'siswabuddha',
            'password' => Hash::make('password'),
            'role' => User::ROLE_SISWA,
            'religion' => 'buddha',
        ]);

        User::create([
            'name' => 'Siswa Konghucu',
            'username' => 'siswakonghucu',
            'password' => Hash::make('password'),
            'role' => User::ROLE_SISWA,
            'religion' => 'konghucu',
        ]);
    }
}


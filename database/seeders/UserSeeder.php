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
            'email' => 'admin@ifter.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_ADMIN,
            'religion' => 'muslim',
        ]);

        // Guru
        User::create([
            'name' => 'Guru Test',
            'username' => 'gurutest',
            'email' => 'guru@ifter.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_GURU,
            'religion' => 'muslim',
        ]);

        // Orangtua
        User::create([
            'name' => 'Orangtua Test',
            'username' => 'orangtuatest',
            'email' => 'orangtua@ifter.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_ORANGTUA,
            'religion' => 'muslim',
        ]);

        // Siswa Muslim
        User::create([
            'name' => 'Siswa Muslim',
            'email' => 'siswa.muslim@ifter.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_SISWA,
            'religion' => 'muslim',
        ]);

        // Siswa Non-Muslim (Kristen)
        User::create([
            'name' => 'Siswa Kristen',
            'email' => 'siswa.kristen@ifter.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_SISWA,
            'religion' => 'kristen',
        ]);

        // Siswa Non-Muslim (Katolik)
        User::create([
            'name' => 'Siswa Katolik',
            'email' => 'siswa.katolik@ifter.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_SISWA,
            'religion' => 'katolik',
        ]);

        // Siswa Non-Muslim (Hindu)
        User::create([
            'name' => 'Siswa Hindu',
            'email' => 'siswa.hindu@ifter.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_SISWA,
            'religion' => 'hindu',
        ]);

        // Siswa Non-Muslim (Buddha)
        User::create([
            'name' => 'Siswa Buddha',
            'email' => 'siswa.buddha@ifter.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_SISWA,
            'religion' => 'buddha',
        ]);
    }
}


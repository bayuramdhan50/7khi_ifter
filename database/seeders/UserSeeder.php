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
        User::updateOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'role' => User::ROLE_ADMIN,
                'religion' => 'muslim',
            ]
        );

        // Guru
        User::updateOrCreate(
            ['username' => 'gurutest'],
            [
                'name' => 'Guru Test',
                'password' => Hash::make('password'),
                'role' => User::ROLE_GURU,
                'religion' => 'muslim',
            ]
        );

        // Orangtua
        User::updateOrCreate(
            ['username' => 'orangtuatest'],
            [
                'name' => 'Orangtua Test',
                'password' => Hash::make('password'),
                'role' => User::ROLE_ORANGTUA,
                'religion' => 'muslim',
            ]
        );

        // Siswa Muslim
        User::updateOrCreate(
            ['username' => 'siswamuslim'],
            [
                'name' => 'Siswa Muslim',
                'password' => Hash::make('password'),
                'role' => User::ROLE_SISWA,
                'religion' => 'muslim',
            ]
        );

        // Siswa Non-Muslim (Kristen)
        User::updateOrCreate(
            ['username' => 'siswakristen'],
            [
                'name' => 'Siswa Kristen',
                'password' => Hash::make('password'),
                'role' => User::ROLE_SISWA,
                'religion' => 'kristen',
            ]
        );

        // Siswa Non-Muslim (Katolik)
        User::updateOrCreate(
            ['username' => 'siswakatoli'],
            [
                'name' => 'Siswa Katolik',
                'password' => Hash::make('password'),
                'role' => User::ROLE_SISWA,
                'religion' => 'katolik',
            ]
        );

        // Siswa Non-Muslim (Hindu)
        User::updateOrCreate(
            ['username' => 'siswahindu'],
            [
                'name' => 'Siswa Hindu',
                'password' => Hash::make('password'),
                'role' => User::ROLE_SISWA,
                'religion' => 'hindu',
            ]
        );

        // Siswa Non-Muslim (Buddha)
        User::updateOrCreate(
            ['username' => 'siswabuddha'],
            [
                'name' => 'Siswa Buddha',
                'password' => Hash::make('password'),
                'role' => User::ROLE_SISWA,
                'religion' => 'buddha',
            ]
        );

        User::updateOrCreate(
            ['username' => 'siswakonghucu'],
            [
                'name' => 'Siswa Konghucu',
                'password' => Hash::make('password'),
                'role' => User::ROLE_SISWA,
                'religion' => 'konghucu',
            ]
        );
    }
}


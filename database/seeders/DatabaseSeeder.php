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
        // Create users with different roles
        User::firstOrCreate(
            ['email' => 'siswa@example.com'],
            [
                'name' => 'Siswa Test',
                'role' => User::ROLE_SISWA,
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        User::firstOrCreate(
            ['email' => 'orangtua@example.com'],
            [
                'name' => 'Orangtua Test',
                'role' => User::ROLE_ORANGTUA,
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        User::firstOrCreate(
            ['email' => 'guru@example.com'],
            [
                'name' => 'Guru Test',
                'role' => User::ROLE_GURU,
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin Test',
                'role' => User::ROLE_ADMIN,
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        // Seed activities
        $this->call(ActivitySeeder::class);
    }
}

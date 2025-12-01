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
        $parents = [
            // Orang tua untuk Ahmad Rizky
            [
                'user' => ['name' => 'Bapak Agus Rizky', 'email' => 'agus.ortu@gmail.com', 'password' => bcrypt('password'), 'role' => 'orangtua'],
                'phone' => '081234567810',
                'occupation' => 'Wiraswasta',
                'relationship' => 'ayah',
            ],
            [
                'user' => ['name' => 'Ibu Ratna Rizky', 'email' => 'ratna.ortu@gmail.com', 'password' => bcrypt('password'), 'role' => 'orangtua'],
                'phone' => '081234567811',
                'occupation' => 'Ibu Rumah Tangga',
                'relationship' => 'ibu',
            ],
            
            // Orang tua untuk Budi Santoso
            [
                'user' => ['name' => 'Bapak Bambang Santoso', 'email' => 'bambang.ortu@gmail.com', 'password' => bcrypt('password'), 'role' => 'orangtua'],
                'phone' => '081234567812',
                'occupation' => 'PNS',
                'relationship' => 'ayah',
            ],
            [
                'user' => ['name' => 'Ibu Dewi Santoso', 'email' => 'dewi.ortu@gmail.com', 'password' => bcrypt('password'), 'role' => 'orangtua'],
                'phone' => '081234567813',
                'occupation' => 'Guru',
                'relationship' => 'ibu',
            ],
            
            // Orang tua untuk Citra Dewi
            [
                'user' => ['name' => 'Bapak Dedi Setiawan', 'email' => 'dedi.ortu@gmail.com', 'password' => bcrypt('password'), 'role' => 'orangtua'],
                'phone' => '081234567814',
                'occupation' => 'Dokter',
                'relationship' => 'ayah',
            ],
            [
                'user' => ['name' => 'Ibu Eka Dewi', 'email' => 'eka.ortu@gmail.com', 'password' => bcrypt('password'), 'role' => 'orangtua'],
                'phone' => '081234567815',
                'occupation' => 'Perawat',
                'relationship' => 'ibu',
            ],
        ];

        foreach ($parents as $parentData) {
            $user = \App\Models\User::create($parentData['user']);
            \App\Models\ParentModel::create([
                'user_id' => $user->id,
                'phone' => $parentData['phone'],
                'address' => 'Bandung, Jawa Barat',
                'occupation' => $parentData['occupation'],
            ]);
        }
    }
}

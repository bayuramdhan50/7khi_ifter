<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClassSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $classes = [
            ['name' => '7A', 'grade' => 7, 'section' => 'A', 'academic_year' => '2025/2026', 'is_active' => true],
            ['name' => '7B', 'grade' => 7, 'section' => 'B', 'academic_year' => '2025/2026', 'is_active' => true],
            ['name' => '7C', 'grade' => 7, 'section' => 'C', 'academic_year' => '2025/2026', 'is_active' => true],
            ['name' => '8A', 'grade' => 8, 'section' => 'A', 'academic_year' => '2025/2026', 'is_active' => true],
            ['name' => '8B', 'grade' => 8, 'section' => 'B', 'academic_year' => '2025/2026', 'is_active' => true],
            ['name' => '9A', 'grade' => 9, 'section' => 'A', 'academic_year' => '2025/2026', 'is_active' => true],
        ];

        foreach ($classes as $class) {
            \App\Models\ClassModel::create($class);
        }
    }
}

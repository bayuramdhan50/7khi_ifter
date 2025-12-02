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
            ['name' => '1A', 'grade' => 1, 'section' => 'A', 'academic_year' => '2025/2026', 'teacher_id' => null],
            ['name' => '1B', 'grade' => 1, 'section' => 'B', 'academic_year' => '2025/2026', 'teacher_id' => null],
            ['name' => '2A', 'grade' => 2, 'section' => 'A', 'academic_year' => '2025/2026', 'teacher_id' => null],
            ['name' => '2B', 'grade' => 2, 'section' => 'B', 'academic_year' => '2025/2026', 'teacher_id' => null],
            ['name' => '3A', 'grade' => 3, 'section' => 'A', 'academic_year' => '2025/2026', 'teacher_id' => null],
            ['name' => '3B', 'grade' => 3, 'section' => 'B', 'academic_year' => '2025/2026', 'teacher_id' => null],
        ];

        foreach ($classes as $class) {
            \App\Models\ClassModel::create($class);
        }
    }
}

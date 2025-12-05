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
        $classes = [];
        $grades = [7, 8, 9];
        $sections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

        foreach ($grades as $grade) {
            foreach ($sections as $section) {
                $classes[] = [
                    'name' => $grade . $section,
                    'grade' => $grade,
                    'section' => $section,
                    'academic_year' => '2025/2026',
                    'teacher_id' => null
                ];
            }
        }

        foreach ($classes as $class) {
            \App\Models\ClassModel::create($class);
        }
    }
}

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
        $teacherId = 2; // Teacher with ID 2 (Guru Test from database)

        foreach ($grades as $grade) {
            foreach ($sections as $section) {
                // Assign teacher only to 7A class
                $assignedTeacherId = ($grade === 7 && $section === 'A') ? $teacherId : null;
                
                $classes[] = [
                    'name' => $grade . $section,
                    'grade' => $grade,
                    'section' => $section,
                    'academic_year' => '2025/2026',
                    'teacher_id' => $assignedTeacherId
                ];
            }
        }

        foreach ($classes as $class) {
            \App\Models\ClassModel::create($class);
        }
    }
}

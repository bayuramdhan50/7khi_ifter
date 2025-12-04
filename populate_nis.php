<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$students = \App\Models\Student::with('user')->get();

$counter = 1;
foreach ($students as $student) {
    $student->student_number = '2025' . str_pad($counter, 6, '0', STR_PAD_LEFT);
    $student->save();
    echo "Updated {$student->user->name} - NIS: {$student->student_number}\n";
    $counter++;
}

echo "\nTotal updated: " . count($students) . " students\n";

<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$students = \App\Models\Student::with('user')->get();

echo "Students in database:\n";
foreach ($students as $student) {
    echo "User: {$student->user->name} - NIS: {$student->student_number}\n";
}

echo "\nTotal: " . count($students) . " students\n";

<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Update email domain for all users to @ifter
$users = \App\Models\User::all();

foreach ($users as $user) {
    // Get username or generate from name
    if ($user->username) {
        $emailPrefix = $user->username;
    } else {
        // For siswa without username, use their name
        $emailPrefix = strtolower(str_replace(' ', '', $user->name));
    }
    
    // Set new email with @ifter domain
    $user->email = $emailPrefix . '@ifter';
    $user->save();
    
    echo "Updated {$user->name} ({$user->role}) - Email: {$user->email}\n";
}

echo "\nTotal updated: " . count($users) . " users\n";

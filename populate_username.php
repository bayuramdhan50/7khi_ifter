<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Update username for non-siswa users (admin, guru, orangtua)
$users = \App\Models\User::whereIn('role', ['admin', 'guru', 'orangtua'])->get();

foreach ($users as $user) {
    // Generate username from name (lowercase, remove spaces)
    $username = strtolower(str_replace(' ', '', $user->name));
    
    // Check if username already exists, if so add number
    $originalUsername = $username;
    $counter = 1;
    while (\App\Models\User::where('username', $username)->where('id', '!=', $user->id)->exists()) {
        $username = $originalUsername . $counter;
        $counter++;
    }
    
    $user->username = $username;
    $user->save();
    
    echo "Updated {$user->name} ({$user->role}) - Username: {$user->username}\n";
}

echo "\nTotal updated: " . count($users) . " users\n";

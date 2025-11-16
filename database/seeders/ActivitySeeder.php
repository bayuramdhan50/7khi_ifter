<?php

namespace Database\Seeders;

use App\Models\Activity;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $activities = [
            ['title' => 'Bangun Pagi', 'icon' => '☀️', 'color' => 'bg-orange-100', 'order' => 1],
            ['title' => 'Berbakti', 'icon' => '🙏', 'color' => 'bg-blue-100', 'order' => 2],
            ['title' => 'Berolahraga', 'icon' => '⚽', 'color' => 'bg-green-100', 'order' => 3],
            ['title' => 'Gemar Belajar', 'icon' => '📚', 'color' => 'bg-yellow-100', 'order' => 4],
            ['title' => 'Makan Makanan Sehat dan Bergizi', 'icon' => '🍎', 'color' => 'bg-pink-100', 'order' => 5],
            ['title' => 'Bermasyarakat', 'icon' => '👨‍👩‍👧‍👦', 'color' => 'bg-purple-100', 'order' => 6],
            ['title' => 'Tidur Cepat', 'icon' => '🌙', 'color' => 'bg-indigo-100', 'order' => 7],
        ];

        foreach ($activities as $activity) {
            Activity::create($activity);
        }
    }
}

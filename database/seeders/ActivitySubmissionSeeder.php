<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ActivitySubmissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $students = \App\Models\Student::all();
        $activities = \App\Models\Activity::all();
        $statuses = ['pending', 'approved', 'rejected'];

        // Generate submissions untuk 10 hari terakhir
        foreach ($students as $student) {
            // Ambil parent pertama (primary) untuk approval
            $primaryParent = $student->parents()->wherePivot('is_primary', true)->first();
            
            for ($day = 10; $day <= 19; $day++) {
                foreach ($activities as $activity) {
                    $status = $statuses[array_rand($statuses)];
                    $date = "2025-11-{$day}";
                    
                    $submission = \App\Models\ActivitySubmission::create([
                        'student_id' => $student->id,
                        'activity_id' => $activity->id,
                        'date' => $date,
                        'time' => sprintf('%02d:%02d:00', rand(6, 22), rand(0, 59)),
                        'photo' => $status === 'approved' ? 'photos/sample.jpg' : null,
                        'notes' => $status === 'rejected' ? 'Perlu diperbaiki' : 'Kegiatan dilakukan dengan baik',
                        'status' => $status,
                        'approved_by' => $status !== 'pending' && $primaryParent ? $primaryParent->id : null,
                        'approved_at' => $status !== 'pending' ? now()->subDays(rand(0, 3)) : null,
                        'rejection_reason' => $status === 'rejected' ? 'Foto tidak jelas' : null,
                    ]);

                    // Buat detail untuk submission tertentu
                    if ($activity->id == 1) { // Bangun Pagi
                        $this->createBangunPagiDetails($submission->id);
                    } elseif ($activity->id == 3) { // Berolahraga
                        $this->createBerolahragaDetails($submission->id);
                    } elseif ($activity->id == 5) { // Makan Sehat
                        $this->createMakanSehatDetails($submission->id);
                    } elseif ($activity->id == 2) { // Beribadah
                        $this->createBeribadahDetails($submission->id);
                    }
                }
            }
        }
    }

    private function createBangunPagiDetails($submissionId)
    {
        $details = [
            ['field_name' => 'membereskan_tempat_tidur', 'field_label' => 'Membereskan Tempat Tidur', 'is_checked' => (bool)rand(0, 1)],
            ['field_name' => 'mandi', 'field_label' => 'Mandi', 'is_checked' => (bool)rand(0, 1)],
            ['field_name' => 'berpakaian_rapi', 'field_label' => 'Berpakaian Rapi', 'is_checked' => (bool)rand(0, 1)],
            ['field_name' => 'sarapan', 'field_label' => 'Sarapan', 'is_checked' => (bool)rand(0, 1)],
        ];

        foreach ($details as $detail) {
            \App\Models\ActivityDetail::create([
                'submission_id' => $submissionId,
                'field_type' => 'checkbox',
                'field_name' => $detail['field_name'],
                'field_label' => $detail['field_label'],
                'field_value' => null,
                'is_checked' => $detail['is_checked'],
            ]);
        }
    }

    private function createBerolahragaDetails($submissionId)
    {
        $durations = ['10', '20', '30', '30+'];
        
        \App\Models\ActivityDetail::create([
            'submission_id' => $submissionId,
            'field_type' => 'dropdown',
            'field_name' => 'waktu_olahraga',
            'field_label' => 'Waktu Berolahraga',
            'field_value' => $durations[array_rand($durations)],
            'is_checked' => false,
        ]);
    }

    private function createMakanSehatDetails($submissionId)
    {
        $karbohidrat = ['Nasi', 'Roti', 'Kentang', 'Mie'];
        $protein = ['Ayam', 'Ikan', 'Telur', 'Tahu/Tempe'];
        $sayur = ['Bayam', 'Kangkung', 'Sawi', 'Brokoli'];
        $buah = ['Apel', 'Pisang', 'Jeruk', 'Mangga'];

        $details = [
            ['field_name' => 'karbohidrat', 'field_label' => 'Karbohidrat', 'value' => $karbohidrat[array_rand($karbohidrat)]],
            ['field_name' => 'protein', 'field_label' => 'Protein', 'value' => $protein[array_rand($protein)]],
            ['field_name' => 'sayur', 'field_label' => 'Sayur', 'value' => $sayur[array_rand($sayur)]],
            ['field_name' => 'buah', 'field_label' => 'Buah', 'value' => $buah[array_rand($buah)]],
        ];

        foreach ($details as $detail) {
            \App\Models\ActivityDetail::create([
                'submission_id' => $submissionId,
                'field_type' => 'dropdown',
                'field_name' => $detail['field_name'],
                'field_label' => $detail['field_label'],
                'field_value' => $detail['value'],
                'is_checked' => false,
            ]);
        }
    }

    private function createBeribadahDetails($submissionId)
    {
        $details = [
            ['field_name' => 'mengaji', 'field_label' => 'Mengaji', 'is_checked' => (bool)rand(0, 1)],
            ['field_name' => 'berdoa', 'field_label' => 'Berdoa', 'is_checked' => (bool)rand(0, 1)],
            ['field_name' => 'bersedekah', 'field_label' => 'Bersedekah', 'is_checked' => (bool)rand(0, 1)],
            ['field_name' => 'lainnya', 'field_label' => 'Lainnya', 'is_checked' => (bool)rand(0, 1)],
        ];

        foreach ($details as $detail) {
            \App\Models\ActivityDetail::create([
                'submission_id' => $submissionId,
                'field_type' => 'checkbox',
                'field_name' => $detail['field_name'],
                'field_label' => $detail['field_label'],
                'field_value' => null,
                'is_checked' => $detail['is_checked'],
            ]);
        }
    }
}

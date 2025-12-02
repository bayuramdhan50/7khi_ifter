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
        $parents = \App\Models\ParentModel::all();
        
        $statuses = ['pending', 'approved', 'rejected'];
        
        // Generate submissions untuk 15 hari terakhir
        foreach ($students as $student) {
            for ($day = 14; $day >= 0; $day--) {
                $date = now()->subDays($day)->format('Y-m-d');
                
                // Random activities per hari (3-5 aktivitas)
                $randomActivities = $activities->random(rand(3, 5));
                
                foreach ($randomActivities as $activity) {
                    $status = $statuses[array_rand($statuses)];
                    $approver = $status === 'approved' || $status === 'rejected' ? $parents->first() : null;
                    
                    $submission = \App\Models\ActivitySubmission::create([
                        'student_id' => $student->id,
                        'activity_id' => $activity->id,
                        'date' => $date,
                        'time' => now()->format('H:i:s'),
                        'photo' => $day % 2 == 0 ? 'photos/sample.jpg' : null,
                        'notes' => 'Catatan kegiatan ' . $activity->name,
                        'status' => $status,
                        'approved_by' => $approver?->id,
                        'approved_at' => $status !== 'pending' ? now() : null,
                        'rejection_reason' => $status === 'rejected' ? 'Foto kurang jelas' : null,
                    ]);

                    // Add details based on activity
                    $this->addActivityDetails($submission, $activity);
                }
            }
        }
    }

    private function addActivityDetails($submission, $activity)
    {
        switch ($activity->name) {
            case 'Bangun Pagi':
                $details = [
                    ['field_name' => 'membereskan_tempat_tidur', 'field_label' => 'Membereskan Tempat Tidur', 'field_type' => 'checkbox', 'is_checked' => (bool)rand(0, 1)],
                    ['field_name' => 'mandi', 'field_label' => 'Mandi', 'field_type' => 'checkbox', 'is_checked' => (bool)rand(0, 1)],
                    ['field_name' => 'berpakaian_rapi', 'field_label' => 'Berpakaian Rapi', 'field_type' => 'checkbox', 'is_checked' => (bool)rand(0, 1)],
                    ['field_name' => 'sarapan', 'field_label' => 'Sarapan', 'field_type' => 'checkbox', 'is_checked' => (bool)rand(0, 1)],
                ];
                break;

            case 'Berolahraga':
                $durasi = ['10', '20', '30', '>30'][array_rand(['10', '20', '30', '>30'])];
                $details = [
                    ['field_name' => 'waktu_berolahraga', 'field_label' => 'Waktu Berolahraga', 'field_type' => 'dropdown', 'field_value' => $durasi],
                ];
                break;

            case 'Gemar Belajar':
                $details = [
                    ['field_name' => 'ekstrakurikuler', 'field_label' => 'Ekstrakurikuler', 'field_type' => 'checkbox', 'is_checked' => (bool)rand(0, 1)],
                    ['field_name' => 'bimbingan_belajar', 'field_label' => 'Bimbingan Belajar', 'field_type' => 'checkbox', 'is_checked' => (bool)rand(0, 1)],
                    ['field_name' => 'mengerjakan_tugas', 'field_label' => 'Mengerjakan Tugas', 'field_type' => 'checkbox', 'is_checked' => (bool)rand(0, 1)],
                    ['field_name' => 'lainnya', 'field_label' => 'Lainnya', 'field_type' => 'checkbox', 'is_checked' => (bool)rand(0, 1)],
                ];
                break;

            case 'Makan Makanan Sehat dan Bergizi':
                $karbohidrat = ['Nasi', 'Roti', 'Mie', 'Kentang'][array_rand(['Nasi', 'Roti', 'Mie', 'Kentang'])];
                $protein = ['Ayam', 'Ikan', 'Telur', 'Tahu'][array_rand(['Ayam', 'Ikan', 'Telur', 'Tahu'])];
                $sayur = ['Bayam', 'Kangkung', 'Sawi', 'Wortel'][array_rand(['Bayam', 'Kangkung', 'Sawi', 'Wortel'])];
                $buah = ['Apel', 'Pisang', 'Jeruk', 'Mangga'][array_rand(['Apel', 'Pisang', 'Jeruk', 'Mangga'])];
                
                $details = [
                    ['field_name' => 'karbohidrat', 'field_label' => 'Karbohidrat', 'field_type' => 'dropdown', 'field_value' => $karbohidrat],
                    ['field_name' => 'protein', 'field_label' => 'Protein', 'field_type' => 'dropdown', 'field_value' => $protein],
                    ['field_name' => 'sayur', 'field_label' => 'Sayur', 'field_type' => 'dropdown', 'field_value' => $sayur],
                    ['field_name' => 'buah', 'field_label' => 'Buah', 'field_type' => 'dropdown', 'field_value' => $buah],
                ];
                break;

            case 'Bermasyarakat':
                $details = [
                    ['field_name' => 'tarka', 'field_label' => 'Tarka', 'field_type' => 'checkbox', 'is_checked' => (bool)rand(0, 1)],
                    ['field_name' => 'kerja_bakti', 'field_label' => 'Kerja Bakti', 'field_type' => 'checkbox', 'is_checked' => (bool)rand(0, 1)],
                    ['field_name' => 'gotong_royong', 'field_label' => 'Gotong Royong', 'field_type' => 'checkbox', 'is_checked' => (bool)rand(0, 1)],
                    ['field_name' => 'lainnya', 'field_label' => 'Lainnya', 'field_type' => 'checkbox', 'is_checked' => (bool)rand(0, 1)],
                ];
                break;

            case 'Tidur Cepat':
                $waktu = ['20:00', '21:00', '22:00'][array_rand(['20:00', '21:00', '22:00'])];
                $details = [
                    ['field_name' => 'waktu_tidur', 'field_label' => 'Waktu Tidur', 'field_type' => 'time', 'field_value' => $waktu],
                ];
                break;

            default:
                $details = [];
        }

        foreach ($details as $detail) {
            \App\Models\ActivityDetail::create([
                'submission_id' => $submission->id,
                'field_type' => $detail['field_type'],
                'field_name' => $detail['field_name'],
                'field_label' => $detail['field_label'],
                'field_value' => $detail['field_value'] ?? null,
                'is_checked' => $detail['is_checked'] ?? false,
            ]);
        }
    }
}

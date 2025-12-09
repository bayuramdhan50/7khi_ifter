<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use App\Models\ActivityDetail;
use App\Models\ActivitySubmission;
use App\Models\BangunPagiDetail;
use App\Models\BerolahragaDetail;
use App\Models\BeribadahDetail;
use App\Models\GemarBelajarDetail;
use App\Models\MakanSehatDetail;
use App\Models\BermasyarakatDetail;
use App\Models\TidurCepatDetail;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Group details by submission_id
        $submissions = ActivitySubmission::with(['details', 'activity'])->get();

        foreach ($submissions as $submission) {
            $activityId = $submission->activity_id;
            $detailsGrouped = [];

            // Group details by field_name for easier access
            foreach ($submission->details as $detail) {
                $detailsGrouped[$detail->field_name] = $detail;
            }

            // Skip if no details
            if (empty($detailsGrouped)) {
                continue;
            }

            // Migrate based on activity_id
            try {
                switch ($activityId) {
                    case 1: // Bangun Pagi
                        $this->migrateBangunPagi($submission->id, $detailsGrouped);
                        break;
                    case 2: // Beribadah
                        $this->migrateBeribadah($submission->id, $detailsGrouped);
                        break;
                    case 3: // Berolahraga
                        $this->migrateBerolahraga($submission->id, $detailsGrouped);
                        break;
                    case 4: // Gemar Belajar
                        $this->migrateGemarBelajar($submission->id, $detailsGrouped);
                        break;
                    case 5: // Makan Sehat
                        $this->migrateMakanSehat($submission->id, $detailsGrouped);
                        break;
                    case 6: // Bermasyarakat
                        $this->migrateBermasyarakat($submission->id, $detailsGrouped);
                        break;
                    case 7: // Tidur Cepat
                        $this->migrateTidurCepat($submission->id, $detailsGrouped);
                        break;
                }
            } catch (\Exception $e) {
                // Log error but continue with other submissions
                \Log::warning("Failed to migrate submission {$submission->id}: " . $e->getMessage());
            }
        }
    }

    private function migrateBangunPagi($submissionId, $details)
    {
        BangunPagiDetail::create([
            'submission_id' => $submissionId,
            'wake_up_time' => $details['jam_bangun']->field_value ?? null,
            'tidy_bed' => $details['membereskan_tempat_tidur']->is_checked ?? false,
            'open_window' => $details['membuka_jendela']->is_checked ?? false,
            'morning_prayer' => $details['berdoa_pagi']->is_checked ?? false,
            'tidy_room' => $details['merapikan_kamar']->is_checked ?? false,
            'sleep_duration' => $details['durasi_tidur']->field_value ?? null,
        ]);
    }

    private function migrateBeribadah($submissionId, $details)
    {
        BeribadahDetail::create([
            'submission_id' => $submissionId,
            // Muslim
            'subuh' => $details['subuh']->is_checked ?? false,
            'dzuhur' => $details['dzuhur']->is_checked ?? false,
            'ashar' => $details['ashar']->is_checked ?? false,
            'maghrib' => $details['maghrib']->is_checked ?? false,
            'isya' => $details['isya']->is_checked ?? false,
            'mengaji' => $details['mengaji']->is_checked ?? false,
            'berdoa' => $details['berdoa']->is_checked ?? false,
            'bersedekah' => $details['bersedekah']->is_checked ?? false,
            'lainnya' => $details['lainnya']->is_checked ?? false,
            // Non-Muslim
            'doa_pagi' => $details['doa_pagi']->is_checked ?? false,
            'baca_firman' => $details['baca_firman']->is_checked ?? false,
            'renungan' => $details['renungan']->is_checked ?? false,
            'doa_malam' => $details['doa_malam']->is_checked ?? false,
            'ibadah_bersama' => $details['ibadah_bersama']->is_checked ?? false,
        ]);
    }

    private function migrateBerolahraga($submissionId, $details)
    {
        BerolahragaDetail::create([
            'submission_id' => $submissionId,
            'exercise_type' => $details['jenis_olahraga']->field_value ?? null,
            'exercise_time' => $details['waktu_olahraga']->field_value ?? null,
            'exercise_duration' => $details['durasi_olahraga']->field_value ?? null,
            'repetition' => $details['jumlah_repetisi']->field_value ?? null,
        ]);
    }

    private function migrateGemarBelajar($submissionId, $details)
    {
        GemarBelajarDetail::create([
            'submission_id' => $submissionId,
            'subject' => $details['mata_pelajaran']->field_value ?? null,
            'study_time' => $details['waktu_belajar']->field_value ?? null,
            'study_duration' => $details['durasi_belajar']->field_value ?? null,
            'study_type' => $details['jenis_kegiatan']->field_value ?? null,
        ]);
    }

    private function migrateMakanSehat($submissionId, $details)
    {
        MakanSehatDetail::create([
            'submission_id' => $submissionId,
            'breakfast' => $details['sarapan']->is_checked ?? false,
            'breakfast_menu' => $details['menu_sarapan']->field_value ?? null,
            'breakfast_time' => $details['waktu_sarapan']->field_value ?? null,
            'lunch' => $details['makan_siang']->is_checked ?? false,
            'lunch_menu' => $details['menu_makan_siang']->field_value ?? null,
            'lunch_time' => $details['waktu_makan_siang']->field_value ?? null,
            'dinner' => $details['makan_malam']->is_checked ?? false,
            'dinner_menu' => $details['menu_makan_malam']->field_value ?? null,
            'dinner_time' => $details['waktu_makan_malam']->field_value ?? null,
            'water_glasses' => $details['jumlah_gelas_air']->field_value ?? null,
            'fruits' => $details['buah']->is_checked ?? false,
            'vegetables' => $details['sayur']->is_checked ?? false,
        ]);
    }

    private function migrateBermasyarakat($submissionId, $details)
    {
        BermasyarakatDetail::create([
            'submission_id' => $submissionId,
            'activity_type' => $details['jenis_kegiatan']->field_value ?? null,
            'activity_description' => $details['deskripsi_kegiatan']->field_value ?? null,
            'activity_duration' => $details['durasi_kegiatan']->field_value ?? null,
            'with_whom' => $details['dengan_siapa']->field_value ?? null,
        ]);
    }

    private function migrateTidurCepat($submissionId, $details)
    {
        TidurCepatDetail::create([
            'submission_id' => $submissionId,
            'sleep_time' => $details['jam_tidur']->field_value ?? null,
            'brush_teeth' => $details['gosok_gigi']->is_checked ?? false,
            'wash_face' => $details['cuci_muka']->is_checked ?? false,
            'change_clothes' => $details['ganti_baju']->is_checked ?? false,
            'prayer_before_sleep' => $details['berdoa_sebelum_tidur']->is_checked ?? false,
            'turn_off_gadget' => $details['matikan_gadget']->is_checked ?? false,
            'tidy_bed_before_sleep' => $details['rapikan_tempat_tidur']->is_checked ?? false,
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Optionally, you can clear the new tables if rolling back
        DB::table('bangun_pagi_details')->truncate();
        DB::table('berolahraga_details')->truncate();
        DB::table('beribadah_details')->truncate();
        DB::table('gemar_belajar_details')->truncate();
        DB::table('makan_sehat_details')->truncate();
        DB::table('bermasyarakat_details')->truncate();
        DB::table('tidur_cepat_details')->truncate();
    }
};

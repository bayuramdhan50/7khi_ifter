<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Final comprehensive cleanup of all unused columns from activity detail tables
     */
    public function up(): void
    {
        // 1. Drop legacy activity_details table if exists
        Schema::dropIfExists('activity_details');

        // 2. Cleanup bangun_pagi_details - keep only: id, submission_id, jam_bangun, membereskan_tempat_tidur, mandi, berpakaian_rapi, sarapan
        Schema::table('bangun_pagi_details', function (Blueprint $table) {
            $columnsToRemove = [];
            $unusedColumns = ['wake_up_time', 'tidy_bed', 'open_window', 'morning_prayer', 'tidy_room', 'sleep_duration'];
            
            foreach ($unusedColumns as $column) {
                if (Schema::hasColumn('bangun_pagi_details', $column)) {
                    $columnsToRemove[] = $column;
                }
            }
            
            if (!empty($columnsToRemove)) {
                $table->dropColumn($columnsToRemove);
            }
        });

        // 3. Cleanup berolahraga_details - keep only: id, submission_id, berolahraga, waktu_berolahraga, exercise_type
        Schema::table('berolahraga_details', function (Blueprint $table) {
            $columnsToRemove = [];
            $unusedColumns = ['exercise_time', 'exercise_duration', 'repetition'];
            
            foreach ($unusedColumns as $column) {
                if (Schema::hasColumn('berolahraga_details', $column)) {
                    $columnsToRemove[] = $column;
                }
            }
            
            if (!empty($columnsToRemove)) {
                $table->dropColumn($columnsToRemove);
            }
        });

        // 4. Cleanup gemar_belajar_details - keep only: id, submission_id, gemar_belajar, ekstrakurikuler, bimbingan_belajar, mengerjakan_tugas, lainnya
        Schema::table('gemar_belajar_details', function (Blueprint $table) {
            $columnsToRemove = [];
            $unusedColumns = ['subject', 'study_time', 'study_duration', 'study_type'];
            
            foreach ($unusedColumns as $column) {
                if (Schema::hasColumn('gemar_belajar_details', $column)) {
                    $columnsToRemove[] = $column;
                }
            }
            
            if (!empty($columnsToRemove)) {
                $table->dropColumn($columnsToRemove);
            }
        });

        // 5. Cleanup makan_sehat_details - keep only: id, submission_id, karbohidrat, protein, sayur, buah
        Schema::table('makan_sehat_details', function (Blueprint $table) {
            $columnsToRemove = [];
            $unusedColumns = ['breakfast', 'breakfast_menu', 'breakfast_time', 
                              'lunch', 'lunch_menu', 'lunch_time',
                              'dinner', 'dinner_menu', 'dinner_time',
                              'water_glasses', 'fruits', 'vegetables'];
            
            foreach ($unusedColumns as $column) {
                if (Schema::hasColumn('makan_sehat_details', $column)) {
                    $columnsToRemove[] = $column;
                }
            }
            
            if (!empty($columnsToRemove)) {
                $table->dropColumn($columnsToRemove);
            }
        });

        // 6. Cleanup bermasyarakat_details - keep only: id, submission_id, tarka, kerja_bakti, gotong_royong, lainnya
        Schema::table('bermasyarakat_details', function (Blueprint $table) {
            $columnsToRemove = [];
            $unusedColumns = ['activity_type', 'activity_description', 'activity_duration', 'with_whom'];
            
            foreach ($unusedColumns as $column) {
                if (Schema::hasColumn('bermasyarakat_details', $column)) {
                    $columnsToRemove[] = $column;
                }
            }
            
            if (!empty($columnsToRemove)) {
                $table->dropColumn($columnsToRemove);
            }
        });

        // 7. Cleanup tidur_cepat_details - keep only: id, submission_id, sleep_time
        Schema::table('tidur_cepat_details', function (Blueprint $table) {
            $columnsToRemove = [];
            $unusedColumns = ['brush_teeth', 'wash_face', 'change_clothes', 
                              'prayer_before_sleep', 'turn_off_gadget', 'tidy_bed_before_sleep'];
            
            foreach ($unusedColumns as $column) {
                if (Schema::hasColumn('tidur_cepat_details', $column)) {
                    $columnsToRemove[] = $column;
                }
            }
            
            if (!empty($columnsToRemove)) {
                $table->dropColumn($columnsToRemove);
            }
        });
    }

    /**
     * Reverse the migrations.
     * Note: We don't restore the dropped columns as they were never used
     */
    public function down(): void
    {
        // Not restoring unused columns as they were never used in the application
    }
};

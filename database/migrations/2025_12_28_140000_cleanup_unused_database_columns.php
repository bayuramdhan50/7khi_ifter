<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Cleanup unused columns and drop legacy activity_details table
     */
    public function up(): void
    {
        // 1. Drop legacy activity_details table
        Schema::dropIfExists('activity_details');

        // 2. Remove unused columns from bangun_pagi_details
        Schema::table('bangun_pagi_details', function (Blueprint $table) {
            $columns = [];
            if (Schema::hasColumn('bangun_pagi_details', 'open_window')) {
                $columns[] = 'open_window';
            }
            if (Schema::hasColumn('bangun_pagi_details', 'morning_prayer')) {
                $columns[] = 'morning_prayer';
            }
            if (Schema::hasColumn('bangun_pagi_details', 'tidy_room')) {
                $columns[] = 'tidy_room';
            }
            if (Schema::hasColumn('bangun_pagi_details', 'sleep_duration')) {
                $columns[] = 'sleep_duration';
            }
            if (!empty($columns)) {
                $table->dropColumn($columns);
            }
        });

        // 3. Remove unused columns from berolahraga_details
        Schema::table('berolahraga_details', function (Blueprint $table) {
            $columns = [];
            if (Schema::hasColumn('berolahraga_details', 'exercise_time')) {
                $columns[] = 'exercise_time';
            }
            if (Schema::hasColumn('berolahraga_details', 'exercise_duration')) {
                $columns[] = 'exercise_duration';
            }
            if (Schema::hasColumn('berolahraga_details', 'repetition')) {
                $columns[] = 'repetition';
            }
            if (!empty($columns)) {
                $table->dropColumn($columns);
            }
        });

        // 4. Remove unused columns from gemar_belajar_details
        Schema::table('gemar_belajar_details', function (Blueprint $table) {
            $columns = [];
            if (Schema::hasColumn('gemar_belajar_details', 'subject')) {
                $columns[] = 'subject';
            }
            if (Schema::hasColumn('gemar_belajar_details', 'study_time')) {
                $columns[] = 'study_time';
            }
            if (Schema::hasColumn('gemar_belajar_details', 'study_duration')) {
                $columns[] = 'study_duration';
            }
            if (Schema::hasColumn('gemar_belajar_details', 'study_type')) {
                $columns[] = 'study_type';
            }
            if (!empty($columns)) {
                $table->dropColumn($columns);
            }
        });

        // 5. Remove unused columns from makan_sehat_details
        Schema::table('makan_sehat_details', function (Blueprint $table) {
            $columns = [];
            $oldColumns = ['breakfast', 'breakfast_menu', 'breakfast_time', 
                          'lunch', 'lunch_menu', 'lunch_time',
                          'dinner', 'dinner_menu', 'dinner_time',
                          'water_glasses', 'fruits', 'vegetables'];
            foreach ($oldColumns as $col) {
                if (Schema::hasColumn('makan_sehat_details', $col)) {
                    $columns[] = $col;
                }
            }
            if (!empty($columns)) {
                $table->dropColumn($columns);
            }
        });

        // 6. Remove unused columns from bermasyarakat_details
        Schema::table('bermasyarakat_details', function (Blueprint $table) {
            $columns = [];
            if (Schema::hasColumn('bermasyarakat_details', 'activity_type')) {
                $columns[] = 'activity_type';
            }
            if (Schema::hasColumn('bermasyarakat_details', 'activity_description')) {
                $columns[] = 'activity_description';
            }
            if (Schema::hasColumn('bermasyarakat_details', 'activity_duration')) {
                $columns[] = 'activity_duration';
            }
            if (Schema::hasColumn('bermasyarakat_details', 'with_whom')) {
                $columns[] = 'with_whom';
            }
            if (!empty($columns)) {
                $table->dropColumn($columns);
            }
        });

        // 7. Remove unused columns from tidur_cepat_details
        Schema::table('tidur_cepat_details', function (Blueprint $table) {
            $columns = [];
            $oldColumns = ['brush_teeth', 'wash_face', 'change_clothes', 
                          'prayer_before_sleep', 'turn_off_gadget', 'tidy_bed_before_sleep'];
            foreach ($oldColumns as $col) {
                if (Schema::hasColumn('tidur_cepat_details', $col)) {
                    $columns[] = $col;
                }
            }
            if (!empty($columns)) {
                $table->dropColumn($columns);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Recreate activity_details table
        Schema::create('activity_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained('activity_submissions')->onDelete('cascade');
            $table->enum('field_type', ['checkbox', 'dropdown', 'time', 'text']);
            $table->string('field_name', 100);
            $table->string('field_label');
            $table->text('field_value')->nullable();
            $table->boolean('is_checked')->default(false);
            $table->timestamps();

            $table->index('submission_id');
            $table->index('field_name');
        });

        // Note: Not restoring the unused columns as they were never used
    }
};

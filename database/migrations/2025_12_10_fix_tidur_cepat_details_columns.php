<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tidur_cepat_details', function (Blueprint $table) {
            // Drop columns that don't exist in the website form
            $table->dropColumn([
                'brush_teeth',
                'wash_face',
                'change_clothes',
                'prayer_before_sleep',
                'turn_off_gadget',
                'tidy_bed_before_sleep',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tidur_cepat_details', function (Blueprint $table) {
            // Restore old columns
            $table->boolean('brush_teeth')->default(false);
            $table->boolean('wash_face')->default(false);
            $table->boolean('change_clothes')->default(false);
            $table->boolean('prayer_before_sleep')->default(false);
            $table->boolean('turn_off_gadget')->default(false);
            $table->boolean('tidy_bed_before_sleep')->default(false);
        });
    }
};

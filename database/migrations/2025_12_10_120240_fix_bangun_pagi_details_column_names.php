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
        Schema::table('bangun_pagi_details', function (Blueprint $table) {
            // Drop English-named columns
            $table->dropColumn(['wake_up_time', 'tidy_bed']);
            
            // Add new columns with Indonesian names
            // mandi, berpakaian_rapi, and sarapan already exist with correct names
            $table->time('jam_bangun')->nullable()->after('submission_id');
            $table->boolean('membereskan_tempat_tidur')->default(false)->after('jam_bangun');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bangun_pagi_details', function (Blueprint $table) {
            // Drop Indonesian columns
            $table->dropColumn(['jam_bangun', 'membereskan_tempat_tidur']);
            
            // Restore English-named columns
            $table->time('wake_up_time')->nullable()->after('submission_id');
            $table->boolean('tidy_bed')->default(false)->after('wake_up_time');
        });
    }
};

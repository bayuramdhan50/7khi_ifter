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
            // Drop old columns
            $table->dropColumn(['open_window', 'morning_prayer', 'tidy_room', 'sleep_duration']);
            
            // Add new columns matching the website form
            $table->boolean('mandi')->default(false)->after('tidy_bed'); // Mandi
            $table->boolean('berpakaian_rapi')->default(false)->after('mandi'); // Berpakaian Rapi
            $table->boolean('sarapan')->default(false)->after('berpakaian_rapi'); // Sarapan
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bangun_pagi_details', function (Blueprint $table) {
            // Drop new columns
            $table->dropColumn(['mandi', 'berpakaian_rapi', 'sarapan']);
            
            // Restore old columns
            $table->boolean('open_window')->default(false)->after('tidy_bed');
            $table->boolean('morning_prayer')->default(false)->after('open_window');
            $table->boolean('tidy_room')->default(false)->after('morning_prayer');
            $table->integer('sleep_duration')->nullable()->after('tidy_room');
        });
    }
};

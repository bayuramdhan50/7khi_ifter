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
        Schema::table('bermasyarakat_details', function (Blueprint $table) {
            // Drop columns that don't exist in the website form
            $table->dropColumn([
                'activity_type',
                'activity_description',
                'activity_duration',
                'with_whom',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bermasyarakat_details', function (Blueprint $table) {
            // Restore old columns
            $table->string('activity_type')->nullable();
            $table->text('activity_description')->nullable();
            $table->string('activity_duration')->nullable();
            $table->string('with_whom')->nullable();
        });
    }
};

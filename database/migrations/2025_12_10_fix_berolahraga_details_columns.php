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
        Schema::table('berolahraga_details', function (Blueprint $table) {
            // Drop old columns
            $table->dropColumn([
                'exercise_type',
                'exercise_time',
                'exercise_duration',
                'repetition',
            ]);
            
            // Add new column
            $table->string('waktu_berolahraga')->nullable()->after('submission_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('berolahraga_details', function (Blueprint $table) {
            // Remove new column
            $table->dropColumn('waktu_berolahraga');
            
            // Restore old columns
            $table->string('exercise_type')->nullable();
            $table->time('exercise_time')->nullable();
            $table->integer('exercise_duration')->nullable();
            $table->integer('repetition')->nullable();
        });
    }
};

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
        Schema::table('gemar_belajar_details', function (Blueprint $table) {
            // Drop old columns
            $table->dropColumn([
                'subject',
                'study_time',
                'study_duration',
                'study_type',
            ]);
            
            // Add new columns matching the form
            $table->boolean('gemar_belajar')->default(false)->after('submission_id');
            $table->boolean('ekstrakurikuler')->default(false)->after('gemar_belajar');
            $table->boolean('bimbingan_belajar')->default(false)->after('ekstrakurikuler');
            $table->boolean('mengerjakan_tugas')->default(false)->after('bimbingan_belajar');
            $table->boolean('lainnya')->default(false)->after('mengerjakan_tugas');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('gemar_belajar_details', function (Blueprint $table) {
            // Remove new columns
            $table->dropColumn([
                'gemar_belajar',
                'ekstrakurikuler',
                'bimbingan_belajar',
                'mengerjakan_tugas',
                'lainnya',
            ]);
            
            // Restore old columns
            $table->string('subject')->nullable();
            $table->time('study_time')->nullable();
            $table->integer('study_duration')->nullable();
            $table->string('study_type')->nullable();
        });
    }
};

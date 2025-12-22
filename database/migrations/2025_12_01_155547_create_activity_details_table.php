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
        Schema::create('activity_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained('activity_submissions')->onDelete('cascade');
            $table->enum('field_type', ['checkbox', 'dropdown', 'time', 'text']);
            $table->string('field_name', 100); // contoh: "membereskan_tempat_tidur", "waktu_olahraga"
            $table->string('field_label'); // contoh: "Membereskan Tempat Tidur"
            $table->text('field_value')->nullable(); // Nilai yang dipilih/diisi
            $table->boolean('is_checked')->default(false); // Untuk checkbox
            $table->timestamps();

            $table->index('submission_id');
            $table->index('field_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_details');
    }
};

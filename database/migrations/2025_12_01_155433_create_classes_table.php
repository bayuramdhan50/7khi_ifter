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
        Schema::create('classes', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50); // contoh: "7A", "8B", "9C"
            $table->integer('grade'); // 7, 8, 9 (SMP)
            $table->string('section', 10); // A, B, C
            $table->foreignId('teacher_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('academic_year', 20); // contoh: "2025/2026"
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['grade', 'section']);
            $table->index('teacher_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classes');
    }
};

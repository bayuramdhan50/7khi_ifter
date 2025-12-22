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
        Schema::create('progress_tracking', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->integer('month'); // 1-12
            $table->integer('year'); // 2025, 2026
            $table->integer('total_submissions')->default(0);
            $table->integer('approved_submissions')->default(0);
            $table->integer('rejected_submissions')->default(0);
            $table->integer('pending_submissions')->default(0);
            $table->decimal('percentage', 5, 2)->default(0); // 0.00 - 100.00
            $table->decimal('rating', 3, 2)->default(0); // 0.00 - 5.00 bintang
            $table->timestamps();

            $table->unique(['student_id', 'month', 'year'], 'unique_student_month_year');
            $table->index('student_id');
            $table->index(['month', 'year']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('progress_tracking');
    }
};

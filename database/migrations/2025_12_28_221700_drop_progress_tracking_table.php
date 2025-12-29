<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Drop unused progress_tracking table - progress is calculated directly from activity_submissions
     */
    public function up(): void
    {
        Schema::dropIfExists('progress_tracking');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('progress_tracking', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->integer('month');
            $table->integer('year');
            $table->integer('total_submissions')->default(0);
            $table->decimal('percentage', 5, 2)->default(0);
            $table->string('rating')->nullable();
            $table->timestamps();

            $table->unique(['student_id', 'month', 'year']);
        });
    }
};

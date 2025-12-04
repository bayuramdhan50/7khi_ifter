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
        Schema::create('parent_student', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->constrained('parents')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->enum('relationship', ['ayah', 'ibu', 'wali']);
            $table->boolean('is_primary')->default(false); // Orang tua utama untuk approval
            $table->timestamps();

            $table->unique(['parent_id', 'student_id', 'relationship'], 'unique_parent_student_relationship');
            $table->index('parent_id');
            $table->index('student_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parent_student');
    }
};

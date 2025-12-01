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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            $table->string('nis', 20)->unique(); // Nomor Induk Siswa
            $table->string('nisn', 20)->unique()->nullable(); // Nomor Induk Siswa Nasional
            $table->foreignId('class_id')->nullable()->constrained('classes')->onDelete('set null');
            $table->enum('gender', ['L', 'P']); // Laki-laki / Perempuan
            $table->date('date_of_birth')->nullable();
            $table->string('religion', 50)->nullable(); // Islam, Kristen, Katolik, Hindu, Buddha, Konghucu
            $table->text('address')->nullable();
            $table->string('photo')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('user_id');
            $table->index('class_id');
            $table->index('nis');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};

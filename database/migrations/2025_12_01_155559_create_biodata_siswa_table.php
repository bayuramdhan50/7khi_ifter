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
        Schema::create('biodata_siswa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->unique()->constrained('students')->onDelete('cascade');
            $table->text('hobi')->nullable();
            $table->string('cita_cita')->nullable();
            $table->string('makanan_kesukaan')->nullable();
            $table->string('minuman_kesukaan')->nullable();
            $table->string('hewan_kesukaan')->nullable();
            $table->text('sesuatu_tidak_suka')->nullable();
            $table->timestamps();

            $table->index('student_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('biodata_siswa');
    }
};

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
        // 1. Bangun Pagi Details
        Schema::create('bangun_pagi_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained('activity_submissions')->onDelete('cascade');
            
            // Waktu bangun
            $table->time('wake_up_time')->nullable();
            
            // Checklist kegiatan
            $table->boolean('tidy_bed')->default(false); // Membereskan tempat tidur
            $table->boolean('open_window')->default(false); // Membuka jendela
            $table->boolean('morning_prayer')->default(false); // Berdoa pagi
            $table->boolean('tidy_room')->default(false); // Merapikan kamar
            
            // Durasi tidur
            $table->integer('sleep_duration')->nullable(); // dalam menit
            
            $table->timestamps();
            
            $table->index('submission_id');
        });

        // 2. Berolahraga Details
        Schema::create('berolahraga_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained('activity_submissions')->onDelete('cascade');
            
            // Jenis olahraga
            $table->string('exercise_type')->nullable(); // push up, sit up, lari, dll
            
            // Waktu olahraga
            $table->time('exercise_time')->nullable();
            
            // Durasi olahraga (menit)
            $table->integer('exercise_duration')->nullable();
            
            // Jumlah/repetisi
            $table->integer('repetition')->nullable();
            
            $table->timestamps();
            
            $table->index('submission_id');
        });

        // 3. Beribadah Details
        Schema::create('beribadah_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained('activity_submissions')->onDelete('cascade');
            
            // Untuk Muslim
            $table->boolean('subuh')->default(false);
            $table->boolean('dzuhur')->default(false);
            $table->boolean('ashar')->default(false);
            $table->boolean('maghrib')->default(false);
            $table->boolean('isya')->default(false);
            $table->boolean('mengaji')->default(false);
            $table->boolean('berdoa')->default(false);
            $table->boolean('bersedekah')->default(false);
            $table->boolean('lainnya')->default(false);
            
            // Untuk Non-Muslim
            $table->boolean('doa_pagi')->default(false);
            $table->boolean('baca_firman')->default(false);
            $table->boolean('renungan')->default(false);
            $table->boolean('doa_malam')->default(false);
            $table->boolean('ibadah_bersama')->default(false);
            
            $table->timestamps();
            
            $table->index('submission_id');
        });

        // 4. Gemar Belajar Details
        Schema::create('gemar_belajar_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained('activity_submissions')->onDelete('cascade');
            
            // Mata pelajaran
            $table->string('subject')->nullable(); // Matematika, IPA, dll
            
            // Waktu belajar
            $table->time('study_time')->nullable();
            
            // Durasi belajar (menit)
            $table->integer('study_duration')->nullable();
            
            // Jenis kegiatan
            $table->string('study_type')->nullable(); // mengerjakan PR, membaca buku, dll
            
            $table->timestamps();
            
            $table->index('submission_id');
        });

        // 5. Makan Sehat Details
        Schema::create('makan_sehat_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained('activity_submissions')->onDelete('cascade');
            
            // Sarapan
            $table->boolean('breakfast')->default(false);
            $table->text('breakfast_menu')->nullable();
            $table->time('breakfast_time')->nullable();
            
            // Makan Siang
            $table->boolean('lunch')->default(false);
            $table->text('lunch_menu')->nullable();
            $table->time('lunch_time')->nullable();
            
            // Makan Malam
            $table->boolean('dinner')->default(false);
            $table->text('dinner_menu')->nullable();
            $table->time('dinner_time')->nullable();
            
            // Minum air
            $table->integer('water_glasses')->nullable(); // jumlah gelas
            
            // Buah dan sayur
            $table->boolean('fruits')->default(false);
            $table->boolean('vegetables')->default(false);
            
            $table->timestamps();
            
            $table->index('submission_id');
        });

        // 6. Bermasyarakat Details
        Schema::create('bermasyarakat_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained('activity_submissions')->onDelete('cascade');
            
            // Jenis kegiatan sosial
            $table->string('activity_type')->nullable(); // membantu orang tua, kerja bakti, dll
            
            // Deskripsi kegiatan
            $table->text('activity_description')->nullable();
            
            // Durasi kegiatan (menit)
            $table->integer('activity_duration')->nullable();
            
            // Dengan siapa
            $table->string('with_whom')->nullable(); // orang tua, teman, tetangga, dll
            
            $table->timestamps();
            
            $table->index('submission_id');
        });

        // 7. Tidur Cepat Details
        Schema::create('tidur_cepat_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained('activity_submissions')->onDelete('cascade');
            
            // Waktu tidur
            $table->time('sleep_time')->nullable();
            
            // Persiapan tidur
            $table->boolean('brush_teeth')->default(false); // Gosok gigi
            $table->boolean('wash_face')->default(false); // Cuci muka
            $table->boolean('change_clothes')->default(false); // Ganti baju
            $table->boolean('prayer_before_sleep')->default(false); // Berdoa sebelum tidur
            
            // Kondisi tidur
            $table->boolean('turn_off_gadget')->default(false); // Matikan gadget
            $table->boolean('tidy_bed_before_sleep')->default(false); // Rapikan tempat tidur
            
            $table->timestamps();
            
            $table->index('submission_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tidur_cepat_details');
        Schema::dropIfExists('bermasyarakat_details');
        Schema::dropIfExists('makan_sehat_details');
        Schema::dropIfExists('gemar_belajar_details');
        Schema::dropIfExists('beribadah_details');
        Schema::dropIfExists('berolahraga_details');
        Schema::dropIfExists('bangun_pagi_details');
    }
};

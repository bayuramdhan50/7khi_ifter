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
            if (!Schema::hasColumn('berolahraga_details', 'exercise_type')) {
                $table->string('exercise_type')->nullable()->after('waktu_berolahraga');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('berolahraga_details', function (Blueprint $table) {
            if (Schema::hasColumn('berolahraga_details', 'exercise_type')) {
                $table->dropColumn('exercise_type');
            }
        });
    }
};

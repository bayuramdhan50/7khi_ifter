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
            $table->boolean('berolahraga')->default(false)->after('submission_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('berolahraga_details', function (Blueprint $table) {
            $table->dropColumn('berolahraga');
        });
    }
};

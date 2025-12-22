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
        Schema::table('makan_sehat_details', function (Blueprint $table) {
            $table->string('karbohidrat')->nullable()->change();
            $table->string('protein')->nullable()->change();
            $table->string('sayur')->nullable()->change();
            $table->string('buah')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('makan_sehat_details', function (Blueprint $table) {
            $table->boolean('karbohidrat')->default(false)->change();
            $table->boolean('protein')->default(false)->change();
            $table->boolean('sayur')->default(false)->change();
            $table->boolean('buah')->default(false)->change();
        });
    }
};

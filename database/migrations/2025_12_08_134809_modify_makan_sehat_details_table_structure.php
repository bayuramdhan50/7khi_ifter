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
            // Drop old columns
            $table->dropColumn([
                'breakfast',
                'breakfast_menu',
                'breakfast_time',
                'lunch',
                'lunch_menu',
                'lunch_time',
                'dinner',
                'dinner_menu',
                'dinner_time',
                'water_glasses',
                'fruits',
                'vegetables'
            ]);
            
            // Add new simplified columns (boolean: 0 or 1)
            $table->boolean('karbohidrat')->default(0)->after('submission_id');
            $table->boolean('protein')->default(0)->after('karbohidrat');
            $table->boolean('sayur')->default(0)->after('protein');
            $table->boolean('buah')->default(0)->after('sayur');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('makan_sehat_details', function (Blueprint $table) {
            // Drop new columns
            $table->dropColumn(['karbohidrat', 'protein', 'sayur', 'buah']);
            
            // Restore old columns
            $table->boolean('breakfast')->default(false);
            $table->string('breakfast_menu')->nullable();
            $table->time('breakfast_time')->nullable();
            $table->boolean('lunch')->default(false);
            $table->string('lunch_menu')->nullable();
            $table->time('lunch_time')->nullable();
            $table->boolean('dinner')->default(false);
            $table->string('dinner_menu')->nullable();
            $table->time('dinner_time')->nullable();
            $table->integer('water_glasses')->default(0);
            $table->boolean('fruits')->default(false);
            $table->boolean('vegetables')->default(false);
        });
    }
};

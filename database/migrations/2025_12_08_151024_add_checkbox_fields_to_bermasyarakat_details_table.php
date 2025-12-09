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
        Schema::table('bermasyarakat_details', function (Blueprint $table) {
            $table->boolean('tarka')->default(false)->after('with_whom');
            $table->boolean('kerja_bakti')->default(false)->after('tarka');
            $table->boolean('gotong_royong')->default(false)->after('kerja_bakti');
            $table->boolean('lainnya')->default(false)->after('gotong_royong');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bermasyarakat_details', function (Blueprint $table) {
            $table->dropColumn(['tarka', 'kerja_bakti', 'gotong_royong', 'lainnya']);
        });
    }
};

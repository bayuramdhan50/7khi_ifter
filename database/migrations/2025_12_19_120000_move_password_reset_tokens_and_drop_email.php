<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Remove primary key on email from password_reset_tokens so we can add an id
        DB::statement('ALTER TABLE password_reset_tokens DROP PRIMARY KEY');

        Schema::table('password_reset_tokens', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id')->nullable()->after('token');
        });

        // Migrate existing token -> user relation by matching the email
        $tokens = DB::table('password_reset_tokens')->get();
        foreach ($tokens as $t) {
            $user = DB::table('users')->where('email', $t->email)->first();
            if ($user) {
                DB::table('password_reset_tokens')->where('id', $t->id ?? $t->token)->update(['user_id' => $user->id]);
            }
        }

        // Drop the email column from password_reset_tokens
        if (Schema::hasColumn('password_reset_tokens', 'email')) {
            Schema::table('password_reset_tokens', function (Blueprint $table) {
                $table->dropColumn('email');
            });
        }

        // Drop email columns from users table
        if (Schema::hasColumn('users', 'email')) {
            Schema::table('users', function (Blueprint $table) {
                // drop unique index on email if exists
                try {
                    $table->dropUnique(['email']);
                } catch (\Exception $e) {
                    // ignore if index does not exist
                }

                $table->dropColumn(['email', 'email_verified_at']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Add email back to users
        Schema::table('users', function (Blueprint $table) {
            $table->string('email')->unique()->after('name');
            $table->timestamp('email_verified_at')->nullable()->after('email');
        });

        // Add email back to password_reset_tokens and try restore values from users
        Schema::table('password_reset_tokens', function (Blueprint $table) {
            if (!Schema::hasColumn('password_reset_tokens', 'email')) {
                $table->string('email')->nullable()->after('token');
            }
        });

        $tokens = DB::table('password_reset_tokens')->get();
        foreach ($tokens as $t) {
            if (!empty($t->user_id)) {
                $user = DB::table('users')->where('id', $t->user_id)->first();
                if ($user) {
                    DB::table('password_reset_tokens')->where('id', $t->id)->update(['email' => $user->email]);
                }
            }
        }

        // restore primary key on email
        DB::statement('ALTER TABLE password_reset_tokens DROP COLUMN id');
        DB::statement('ALTER TABLE password_reset_tokens ADD PRIMARY KEY (`email`)');

        // drop user_id column
        if (Schema::hasColumn('password_reset_tokens', 'user_id')) {
            Schema::table('password_reset_tokens', function (Blueprint $table) {
                $table->dropColumn('user_id');
            });
        }
    }
};

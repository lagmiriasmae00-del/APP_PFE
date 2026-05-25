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
        // Add niveau to user_profiles if missing
        if (Schema::hasTable('user_profiles') && !Schema::hasColumn('user_profiles', 'niveau')) {
            Schema::table('user_profiles', function (Blueprint $table) {
                $table->integer('niveau')->nullable()->after('prenom');
            });
        }

        // Copy niveau from users to user_profiles
        if (Schema::hasTable('users') && Schema::hasColumn('users', 'niveau') &&
            Schema::hasTable('user_profiles') && Schema::hasColumn('user_profiles', 'niveau')) {
            \DB::statement('
                UPDATE user_profiles up
                JOIN users u ON u.id = up.user_id
                SET up.niveau = u.niveau
                WHERE up.niveau IS NULL AND u.niveau IS NOT NULL
            ');
        }

        // Remove niveau from users table
        if (Schema::hasTable('users') && Schema::hasColumn('users', 'niveau')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('niveau');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                $table->integer('niveau')->default(1)->after('name');
            });
        }

        if (Schema::hasTable('user_profiles')) {
            Schema::table('user_profiles', function (Blueprint $table) {
                $table->dropColumn('niveau');
            });
        }
    }
};

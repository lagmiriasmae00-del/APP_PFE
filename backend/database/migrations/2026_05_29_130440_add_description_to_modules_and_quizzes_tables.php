<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        if (Schema::hasTable('modules') && !Schema::hasColumn('modules', 'description')) {
            Schema::table('modules', function (Blueprint $table) {
                $table->text('description')->nullable()->after('titre');
            });
        }

        if (Schema::hasTable('quizzes') && !Schema::hasColumn('quizzes', 'description')) {
            Schema::table('quizzes', function (Blueprint $table) {
                $table->text('description')->nullable()->after('titre');
            });
        }
    }

    
    public function down(): void
    {
        if (Schema::hasTable('modules')) {
            Schema::table('modules', function (Blueprint $table) {
                $table->dropColumn('description');
            });
        }

        if (Schema::hasTable('quizzes')) {
            Schema::table('quizzes', function (Blueprint $table) {
                $table->dropColumn('description');
            });
        }
    }
};

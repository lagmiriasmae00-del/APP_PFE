<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        if (Schema::hasTable('results') && !Schema::hasColumn('results', 'deleted_at')) {
            Schema::table('results', function (Blueprint $table) {
                $table->softDeletes();
            });
        }
        
        if (Schema::hasTable('user_reponses') && !Schema::hasColumn('user_reponses', 'deleted_at')) {
            Schema::table('user_reponses', function (Blueprint $table) {
                $table->softDeletes();
            });
        }
    }

    
    public function down(): void
    {
        if (Schema::hasTable('results')) {
            Schema::table('results', function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }
        
        if (Schema::hasTable('user_reponses')) {
            Schema::table('user_reponses', function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }
    }
};

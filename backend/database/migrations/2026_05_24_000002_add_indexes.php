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
        // Composite index for modules queries
        if (Schema::hasTable('modules')) {
            Schema::table('modules', function (Blueprint $table) {
                if (!Schema::hasIndex('modules', 'modules_filiere_id_niveau_index')) {
                    $table->index(['filiere_id', 'niveau']);
                }
            });
        }

        // Index for results queries
        if (Schema::hasTable('results')) {
            Schema::table('results', function (Blueprint $table) {
                if (!Schema::hasIndex('results', 'results_user_id_date_passe_index')) {
                    $table->index(['user_id', 'date_passe']);
                }
            });
        }

        // Index for user responses
        if (Schema::hasTable('user_reponses')) {
            Schema::table('user_reponses', function (Blueprint $table) {
                if (!Schema::hasIndex('user_reponses', 'user_reponses_user_id_question_id_index')) {
                    $table->index(['user_id', 'question_id']);
                }
            });
        }

        // Index for documents
        if (Schema::hasTable('documents')) {
            Schema::table('documents', function (Blueprint $table) {
                if (!Schema::hasIndex('documents', 'documents_module_id_type_index')) {
                    $table->index(['module_id', 'type']);
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('modules')) {
            Schema::table('modules', function (Blueprint $table) {
                $table->dropIndex('modules_filiere_id_niveau_index');
            });
        }

        if (Schema::hasTable('results')) {
            Schema::table('results', function (Blueprint $table) {
                $table->dropIndex('results_user_id_date_passe_index');
            });
        }

        if (Schema::hasTable('user_reponses')) {
            Schema::table('user_reponses', function (Blueprint $table) {
                $table->dropIndex('user_reponses_user_id_question_id_index');
            });
        }

        if (Schema::hasTable('documents')) {
            Schema::table('documents', function (Blueprint $table) {
                $table->dropIndex('documents_module_id_type_index');
            });
        }
    }
};

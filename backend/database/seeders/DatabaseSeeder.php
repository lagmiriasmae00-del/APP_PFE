<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // === 1. تصفية الجداول عشان التيست يكون نقي ===
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('user_profiles')->truncate();
        DB::table('users')->truncate();
        DB::table('filieres')->truncate();
        DB::table('modules')->truncate();
        DB::table('lessons')->truncate();
        DB::table('documents')->truncate();
        DB::table('document_files')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // === 2. Création dial l-compte f la table 'users' ===
        $userId = DB::table('users')->insertGetId([
            'name' => 'Admin EduLink',
            'email' => 'admin@edulink.com',
            'password' => bcrypt('admin'), // المودپاص هو admin
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // === 3. Création dial l-profil f la table 'user_profiles' ===
        DB::table('user_profiles')->insert([
            'nom' => 'EduLink',
            'prenom' => 'Admin',
            'niveau' => null, 
            'role' => 'admin', 
            'filiere_id' => null, 
            'user_id' => $userId, 
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // === 4. Création dial les Filières ===
        $filiereDevId = DB::table('filieres')->insertGetId([
            'nom' => 'Développement Digital',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $filiereIdId = DB::table('filieres')->insertGetId([
            'nom' => 'Infrastructure Digitale',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // === 5. Création dial les Modules ===
        $moduleReactId = DB::table('modules')->insertGetId([
            'filiere_id'  => $filiereDevId,
            'titre'       => 'Développement Front-end avec React',
            'description' => 'Composants, Hooks, Redux Toolkit et Axios',
            'niveau'      => 2,
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);

        $moduleLaravelId = DB::table('modules')->insertGetId([
            'filiere_id'  => $filiereDevId,
            'titre'       => 'Développement Back-end avec Laravel',
            'description' => 'Routes, Contrôleurs, Eloquent ORM et API REST',
            'niveau'      => 2,
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);

        $moduleRéseauId = DB::table('modules')->insertGetId([
            'filiere_id'  => $filiereIdId,
            'titre'       => 'Réseaux Cisco et Routage',
            'description' => 'Protocoles TCP/IP, VLAN, Routage statique et dynamique',
            'niveau'      => 1,
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);

        // === 6. Création dial les Leçons ===
        DB::table('lessons')->insert([
            'module_id'  => $moduleReactId,
            'titre'      => 'Introduction aux Components et Props',
            'contenu'    => 'Apprenez les bases des composants React et la transmission des données via les props.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('lessons')->insert([
            'module_id'  => $moduleLaravelId,
            'titre'      => 'Création des Migrations et Seeders',
            'contenu'    => 'Gérez la structure de votre base de données avec les migrations et peupler les données avec les seeders.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // === 7. Création dial les Documents ===
        $documentId = DB::table('documents')->insertGetId([
            'titre' => 'Examen National React 2025',
            'type' => 'efm',
            'niveau' => 2,
            'annee' => 2025,
            'filiere_id' => $filiereDevId,
            'module_id' => $moduleReactId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // === 8. Création dial les Document Files ===
        DB::table('document_files')->insert([
            'file_url' => 'uploads/documents/efm_react_2025.pdf',
            'file_type' => 'pdf',
            'document_id' => $documentId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
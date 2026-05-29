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

        // === 4. Création dial les Filières (حيدنا الـ description نهائياً) ===
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
            'filiere_id' => $filiereDevId,
            'titre' => 'Développement Front-end avec React',
            'description' => 'Composants, Hooks, Redux Toolkit et Axios',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $moduleLaravelId = DB::table('modules')->insertGetId([
            'filiere_id' => $filiereDevId,
            'titre' => 'Développement Back-end avec Laravel',
            'description' => 'Architecture MVC, API RESTful et Eloquent ORM',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('modules')->insert([
            'filiere_id' => $filiereIdId,
            'titre' => 'Réseaux Cisco et Routage',
            'description' => 'Configuration des routeurs, switchs et protocoles',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // === 6. Création dial les Leçons ===
        DB::table('lessons')->insert([
            'module_id' => $moduleReactId,
            'titre' => 'Introduction aux Components et Props',
            'contenu' => 'Dans cette leçon, nous allons découvrir la structure de base d\'un composant React...',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('lessons')->insert([
            'module_id' => $moduleReactId,
            'titre' => 'Gestion d\'état avec le Hook useState',
            'contenu' => 'Le hook useState permet d\'ajouter un état local aux composants fonctionnels...',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('lessons')->insert([
            'module_id' => $moduleLaravelId,
            'titre' => 'Création des Migrations et Seeders',
            'contenu' => 'Découvrez comment structurer votre base de données en utilisant les commandes Artisan...',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
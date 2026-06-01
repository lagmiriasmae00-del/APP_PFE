<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Filiere;
use App\Models\Module;
use App\Models\Lesson;
use App\Models\LessonVideo;
use App\Models\Quizze;
use App\Models\Question;
use App\Models\Choice;
use App\Models\Document;
use App\Models\DocumentFile;
use App\Models\User;

class TestDataSeeder extends Seeder
{
    
    public function run()
    {
        

        $admin = User::firstOrCreate(
            ['email' => 'admin@smartlearn.com'],
            [
                'name' => 'Admin SmartLearn',
                'password' => bcrypt('password')
            ]
        );

        

        $filiere = Filiere::firstOrCreate(
            ['nom' => 'Développement Digital - Option Web Full Stack']
        );

        

        $modulesData = [
            [
                'titre' => 'Développement Back-end avec Laravel',
                'niveau' => 2,
                'description' => 'Maîtriser le framework PHP Laravel pour créer des applications web robustes et sécurisées.',
                'lessons' => [
                    ['titre' => 'Introduction au routage et aux contrôleurs', 'contenu' => '<p>Comprendre le cycle de vie de la requête MVC dans Laravel.</p>'],
                    ['titre' => 'Eloquent ORM et Migrations', 'contenu' => '<p>Gérer la base de données avec Eloquent et les relations.</p>'],
                ]
            ],
            [
                'titre' => 'L\'approche Agile',
                'niveau' => 1,
                'description' => 'Comprendre les principes agiles et le framework Scrum pour la gestion de projets informatiques.',
                'lessons' => [
                    ['titre' => 'Les valeurs du manifeste Agile', 'contenu' => '<p>Découverte des 4 valeurs et 12 principes de l\'agilité.</p>'],
                    ['titre' => 'Scrum: Rôles, Cérémonies et Artéfacts', 'contenu' => '<p>Comment organiser un Sprint efficacement.</p>'],
                ]
            ],
            [
                'titre' => 'Développement Front-end avec React',
                'niveau' => 2,
                'description' => 'Créer des interfaces utilisateurs dynamiques avec React.js.',
                'lessons' => [
                    ['titre' => 'Les Hooks: useState et useEffect', 'contenu' => '<p>Gérer l\'état et le cycle de vie dans les composants fonctionnels.</p>'],
                    ['titre' => 'React Router et Navigation', 'contenu' => '<p>Créer une Single Page Application (SPA) robuste.</p>'],
                ]
            ]
        ];

        foreach ($modulesData as $data) {
            

            $module = Module::create([
                'titre' => $data['titre'],
                'niveau' => $data['niveau'],
                'description' => $data['description'],
                'filiere_id' => $filiere->id
            ]);

            

            foreach ($data['lessons'] as $index => $lessonData) {
                $lesson = Lesson::create([
                    'titre' => $lessonData['titre'],
                    'contenu' => $lessonData['contenu'],
                    'pdf_url' => null,
                    'video_url' => null,
                    'module_id' => $module->id
                ]);

                LessonVideo::create([
                    'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    'order' => 1,
                    'lesson_id' => $lesson->id
                ]);
            }

            

            $quiz = Quizze::create([
                'titre' => 'Quiz d\'évaluation : ' . $module->titre,
                'module_id' => $module->id
            ]);

            

            for ($i = 1; $i <= 3; $i++) {
                $question = $quiz->questions()->create([
                    'question' => 'Question test numéro ' . $i . ' sur ' . $module->titre . ' ?',
                    'point' => 2,
                ]);

                

                Choice::create(['text_choix' => 'Une réponse incorrecte', 'est_correcte' => false, 'question_id' => $question->id]);
                Choice::create(['text_choix' => 'La bonne réponse !', 'est_correcte' => true, 'question_id' => $question->id]);
                Choice::create(['text_choix' => 'Une autre réponse fausse', 'est_correcte' => false, 'question_id' => $question->id]);
            }

            

            $document = Document::create([
                'titre' => 'Support de cours et Exercices',
                'type' => 'efm',
                'niveau' => $data['niveau'],
                'annee' => 2026,
                'filiere_id' => $filiere->id,
                'module_id' => $module->id
            ]);

            DocumentFile::create([
                'file_url' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                'file_type' => 'Cours',
                'document_id' => $document->id
            ]);
            DocumentFile::create([
                'file_url' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                'file_type' => 'EFM',
                'document_id' => $document->id
            ]);
        }
    }
}
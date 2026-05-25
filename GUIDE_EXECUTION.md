# 🚀 GUIDE D'EXÉCUTION DES CORRECTIONS

**Date:** 24 mai 2026  
**Durée estimée:** 15-20 minutes

---

## 📋 PRÉ-REQUIS

- [x] PHP 8.2+
- [x] Laravel 12
- [x] Base de données configurée
- [x] Fichier .env correctement renseigné

---

## 🔄 ÉTAPE 1: Exécuter les Migrations

### Commandes à exécuter:

```bash
# Naviguer vers le dossier backend
cd backend

# Exécuter les migrations
php artisan migrate

# Voir le statut
php artisan migrate:status
```

**Résultat attendu:**
```
Migration name ........................... Batch / Status
2026_05_24_000000_remove_niveau_from_users ... 1 / Ran
2026_05_24_000001_add_soft_deletes ....... 1 / Ran
2026_05_24_000002_add_indexes ............ 1 / Ran
```

### En cas d'erreur:

```bash
# Rollback des migrations (en cas de problème)
php artisan migrate:rollback --step=3

# Vérifier les erreurs
php artisan migrate:fresh --seed
```

---

## 🔧 ÉTAPE 2: Nettoyer les Caches

```bash
# Nettoyer config
php artisan config:clear

# Nettoyer cache
php artisan cache:clear

# Nettoyer views
php artisan view:clear

# Nettoyer routes
php artisan route:clear
```

---

## ⚙️ ÉTAPE 3: Vérifier la Configuration

### Vérifier le fichier .env:

```bash
# Afficher les valeurs importantes
grep "APP_DEBUG\|DB_CONNECTION" .env

# APP_DEBUG DOIT être: false
# DB_CONNECTION DOIT être: mysql (ou votre DB)
```

### Vérifier la config/quiz.php:

```bash
# Vérifier qu'elle est chargée
php artisan tinker
>>> config('quiz.passing_score')
=> 50
>>> config('quiz.valid_levels')
=> [1, 2, 3]
>>> exit
```

---

## 🧪 ÉTAPE 4: Tester les Endpoints

### Test 1: Rate Limiting sur /login

```bash
# Tester le rate limiting (5 essais max par minute)
for i in {1..6}; do
  curl -X POST http://localhost:8000/api/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"password"}' \
    -w "Tentative $i - Status: %{http_code}\n"
  sleep 1
done

# À partir du 6ème essai, vous devriez avoir un 429 (Too Many Requests)
```

### Test 2: Fichier Upload Sécurisé

```bash
# Créer un PDF de test
echo "%PDF-1.4" > test.pdf

# Tenter l'upload
curl -X POST http://localhost:8000/api/documents \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "titre=Test Doc" \
  -F "type=cc" \
  -F "module_id=1" \
  -F "file=@test.pdf"

# Résultat attendu: 201 Created (si le fichier est valide)
```

### Test 3: Vérifier les Soft Deletes

```bash
php artisan tinker

# Vérifier qu'un module a le trait SoftDeletes
>>> $module = App\Models\Module::first();
=> Module {id: 1, ...}
>>> $module->delete();
=> true
>>> App\Models\Module::find(1);
=> null
>>> App\Models\Module::withTrashed()->find(1);
=> Module {id: 1, deleted_at: "2026-05-24 ..."}
>>> $module->restore();
=> true
>>> exit
```

### Test 4: Vérifier le Caching

```bash
php artisan tinker
>>> Cache::forget('user_1_stats');
>>> $stats = Cache::get('user_1_stats');
=> null
>>> // Faire un appel à /dashboard-stats
>>> $stats = Cache::get('user_1_stats');
=> Array [...]
>>> exit
```

### Test 5: Vérifier les Transactions

```bash
php artisan tinker
>>> // Ouvrir une session pour tester
>>> $user = App\Models\User::first();
>>> $quiz = App\Models\Quizze::first();
>>> // Faire un POST /quiz/{id}/submit avec les réponses
>>> // Vérifier que tout est enregistré correctement
>>> App\Models\Result::where('quiz_id', $quiz->id)->first();
=> Result {...}
>>> exit
```

---

## 📊 ÉTAPE 5: Vérifier les Logs

```bash
# Afficher les logs en temps réel
tail -f storage/logs/laravel.log

# Chercher les erreurs
grep "ERROR" storage/logs/laravel.log

# Chercher les actions loggées
grep "Module created\|Quiz submitted\|Document uploaded" storage/logs/laravel.log
```

---

## 🔐 ÉTAPE 6: Vérifier la Sécurité

```bash
# 1. Vérifier APP_DEBUG=false
grep APP_DEBUG .env
# Résultat attendu: APP_DEBUG=false

# 2. Vérifier les permissions de fichiers
ls -l storage/ config/

# 3. Vérifier que les variables sensibles sont en .env
grep APP_KEY .env
grep DB_PASSWORD .env

# 4. Tester l'absence de stacktrace en mode debug
curl -X GET http://localhost:8000/api/invalid-endpoint
# Ne doit PAS retourner de stacktrace détaillée
```

---

## ✅ ÉTAPE 7: Checklist Finale

- [ ] Migrations exécutées sans erreur
- [ ] Rate limiting actif (429 après 5 essais)
- [ ] Fichier MIME validé correctement
- [ ] Soft deletes fonctionnels
- [ ] Caching en place
- [ ] Transactions en place
- [ ] Logs présents et corrects
- [ ] APP_DEBUG=false
- [ ] Pas de stacktrace exposée
- [ ] Routes 404 pour les endpoints manquants

---

## 🚀 ÉTAPE 8: Déployer en Production

```bash
# 1. SSH sur le serveur
ssh user@server.com

# 2. Naviguer au projet
cd /var/www/app_pfe/backend

# 3. Pull les modifications
git pull origin main

# 4. Installer les dépendances
composer install --no-dev --optimize-autoloader

# 5. Exécuter les migrations
php artisan migrate --force

# 6. Nettoyer les caches
php artisan config:clear
php artisan cache:clear
php artisan view:clear

# 7. Redémarrer les services
sudo systemctl restart php-fpm
sudo systemctl restart nginx

# 8. Vérifier les logs
tail -f storage/logs/laravel.log
```

---

## 🆘 TROUBLESHOOTING

### Problème: Migration échoue

```bash
# Solution 1: Vérifier la connexion à la BD
php artisan migrate:fresh

# Solution 2: Exécuter une migration spécifique
php artisan migrate --path=database/migrations/2026_05_24_000000_remove_niveau_from_users.php

# Solution 3: Rollback et retry
php artisan migrate:rollback
php artisan migrate
```

### Problème: Soft deletes ne fonctionne pas

```bash
# Vérifier que les modèles utilisent SoftDeletes
grep -r "use SoftDeletes" app/Models/

# Vérifier la colonne deleted_at existe
php artisan tinker
>>> DB::table('modules')->getColumns();
```

### Problème: Rate limiting ne fonctionne pas

```bash
# Vérifier que le middleware est enregistré
grep "throttle" routes/api.php

# Vérifier le cache (Redis/File)
php artisan config:show cache.default
```

### Problème: Fichiers ne sont pas stockés

```bash
# Vérifier les permissions du dossier storage
chmod -R 775 storage/app/documents
chmod -R 775 storage/app/lessons_pdfs

# Vérifier le symlink public
php artisan storage:link
```

---

## 📞 SUPPORT

Si vous rencontrez des problèmes:

1. Vérifier les logs: `storage/logs/laravel.log`
2. Vérifier .env: `cat .env | grep -E "DEBUG|DATABASE|CACHE"`
3. Exécuter: `php artisan doctor` (si disponible)
4. Consulter le rapport: `RAPPORT_COMPLET_PROBLEMES.md`

---

**Généré:** 24 mai 2026  
**Confidentiel**

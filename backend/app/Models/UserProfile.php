<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
       protected $fillable = [
        'nom',
        'prenom',
        'role',
        'filiere_id',
        'user_id',
        'niveau'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }
}

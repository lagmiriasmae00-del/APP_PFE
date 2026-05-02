<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\UserProfile;
use App\Models\Module;
use App\Models\Document;

class Filiere extends Model
{
     protected $fillable = ['nom'];

    public function modules()
    {
        return $this->hasMany(Module::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    public function profiles()
    {
        return $this->hasMany(UserProfile::class);
    }
}

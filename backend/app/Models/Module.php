<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Quizze;
use App\Models\Lesson;
use App\Models\Filiere;
use App\Models\Document;
class Module extends Model
{
    protected $fillable = ['titre', 'niveau', 'filiere_id'];

    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }

    public function quizzes()
    {
        return $this->hasMany(Quizze::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }
}

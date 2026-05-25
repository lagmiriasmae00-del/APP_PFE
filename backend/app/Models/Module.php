<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Module extends Model
{
    use SoftDeletes;

    protected $fillable = ['titre', 'niveau', 'filiere_id', 'description'];

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

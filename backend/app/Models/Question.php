<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Choice;
use App\Models\Quizze;


class Question extends Model
{
     protected $fillable = ['question', 'point', 'quizze_id'];

    public function quizze()
    {
        return $this->belongsTo(Quizze::class,'quizze_id');
    }

    public function choices()
    {
        return $this->hasMany(Choice::class);
    }
}

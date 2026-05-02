<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Question;


class Choice extends Model
{
    protected $fillable = ['text_choix', 'est_correcte', 'question_id'];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}

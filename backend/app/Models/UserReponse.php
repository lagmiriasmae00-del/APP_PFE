<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Choice;
use App\Models\Question;
use App\Models\User;

class UserReponse extends Model
{
    protected $fillable = ['user_id', 'question_id', 'choice_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    public function choice()
    {
        return $this->belongsTo(Choice::class);
    }
}

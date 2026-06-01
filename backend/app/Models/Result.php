<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Result extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'score',
        'passe',
        'user_id',
        'quiz_id',
        'date_passe',
        'reponse_correcte'
    ];

    protected $casts = [
        'passe' => 'boolean',
        'date_passe' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function quizze()
    {
        return $this->belongsTo(Quizze::class, 'quiz_id');
    }
}

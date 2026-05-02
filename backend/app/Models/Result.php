<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Quizze;
class Result extends Model
{
    protected $fillable = [
        'score',
        'passe',
        'user_id',
        'quizze_id',
        'date_passe'
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
        return $this->belongsTo(Quizze::class);
    }
}

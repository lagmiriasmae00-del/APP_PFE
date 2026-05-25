<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Question extends Model
{
    use SoftDeletes;

    protected $fillable = ['question', 'point', 'quizze_id'];

    public function quizze()
    {
        return $this->belongsTo(Quizze::class, 'quizze_id');
    }

    public function choices()
    {
        return $this->hasMany(Choice::class);
    }
}

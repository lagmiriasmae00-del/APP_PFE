<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Quizze extends Model
{
    use SoftDeletes;

    protected $fillable = ['titre', 'module_id', 'description'];
    protected $table = 'quizzes';

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function questions()
    {
        return $this->hasMany(Question::class, 'quizze_id');
    }

    public function results()
    {
        return $this->hasMany(Result::class, 'quiz_id');
    }
}

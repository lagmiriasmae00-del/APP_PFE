<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Choice extends Model
{
    use SoftDeletes;

    protected $fillable = ['text_choix', 'est_correcte', 'question_id'];

    protected $casts = [
        'est_correcte' => 'boolean'
    ];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}

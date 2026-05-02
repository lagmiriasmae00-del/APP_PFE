<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Module;
use App\Models\LessonVideo;

class Lesson extends Model
{
    protected $fillable = ['titre', 'contenu', 'pdf_url', 'module_id'];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function videos()
    {
        return $this->hasMany(LessonVideo::class);
    }
}

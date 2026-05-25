<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lesson extends Model
{
    use SoftDeletes;

    protected $fillable = ['titre', 'contenu', 'pdf_url', 'video_url', 'module_id'];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function videos()
    {
        return $this->hasMany(LessonVideo::class)->orderBy('order', 'asc');
    }
}

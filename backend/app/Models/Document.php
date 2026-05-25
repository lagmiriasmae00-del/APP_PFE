<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'titre',
        'type',
        'file_url',
        'file_size',
        'module_id',
        'uploaded_by'
    ];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function files()
    {
        return $this->hasMany(DocumentFile::class);
    }
}


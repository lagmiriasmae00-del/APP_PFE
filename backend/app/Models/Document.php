<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Filiere;
use App\Models\Module;
use App\Models\DocumentFile;

class Document extends Model
{
    protected $fillable = [
        'titre',
        'type',
        'niveau',
        'annee',
        'filiere_id',
        'module_id'
    ];

    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function files()
    {
        return $this->hasMany(DocumentFile::class);
    }
}

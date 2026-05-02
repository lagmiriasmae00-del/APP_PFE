<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentFile extends Model
{
    protected $fillable = ['file_url', 'file_type', 'document_id'];

    public function document()
    {
        return $this->belongsTo(Document::class);
    }
}

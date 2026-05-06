<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Document;

class DocumentController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validation: كنتأكدو بلي الملف PDF وما فايتش 10MB
        $request->validate([
            'titre' => 'required|string',
            'file' => 'required|file|mimes:pdf|max:10240',
            'type' => 'required|in:cc,regional,efm',
            'module_id' => 'required|exists:modules,id'
        ]);

        // 2. الرفع: Laravel كياخد الملف وكيعطيه سمية فريدة وكيحطو فـ مجلد documents
        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('documents', 'public');
            
            // 3. التسجيل فـ الداتابيز: كنسجلو المسار (Path)
            $document = Document::create([
                'titre' => $request->titre,
                'file_url' => $path, // غايتخزن بحال documents/xyz.pdf
                'module_id' => $request->module_id
            ]);

            return response()->json([
                'message' => 'Document téléchargé avec succès',
                'document' => $document,
                'full_url' => asset('storage/' . $path) // هادا هو الرابط اللي غيخدم فـ React
            ], 201);
        }
    }
}

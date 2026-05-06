<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lesson;


class LessonController extends Controller
{
    public function store(Request $request) {
        $request->validate([
            'titre' => 'required',
            'pdf_file' => 'nullable|mimes:pdf|max:10240',
            'module_id' => 'required|exists:modules,id'
        ]);

        $path = $request->hasFile('pdf_file') 
                ? $request->file('pdf_file')->store('lessons_pdfs', 'public') 
                : null;

        $lesson = Lesson::create([
            'titre' => $request->titre,
            'pdf_url' => $path,
            'module_id' => $request->module_id,
            'video_url' => $request->video_url, // رابط يوتيوب
            'contenu' => $request->contenu
        ]);
        
        return response()->json($lesson);
    }
}

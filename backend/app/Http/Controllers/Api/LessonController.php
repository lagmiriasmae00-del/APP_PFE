<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lesson;
use App\Models\LessonVideo;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class LessonController extends Controller
{
    public function index(): JsonResponse
    {
        $lessons = Lesson::with(['module', 'videos'])->orderBy('id', 'desc')->get();
        return response()->json($lessons);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'module_id' => 'required|integer|exists:modules,id',
            'pdf_file' => 'nullable|file|mimes:pdf|max:10240',
            'contenu' => 'nullable|string',
            'videos' => 'nullable|array', 
            'videos.*.video_url' => 'required|url',
            'videos.*.order' => 'required|integer'
        ]);

        return DB::transaction(function () use ($request) {
            $path = null;
            
            if ($request->hasFile('pdf_file')) {
                $file = $request->file('pdf_file');
                $finfo = finfo_open(FILEINFO_MIME_TYPE);
                $mimeType = finfo_file($finfo, $file->getRealPath());
                finfo_close($finfo);

                if ($mimeType !== 'application/pdf') {
                    return response()->json(['error' => 'Invalid PDF file'], 422);
                }

                $fileName = Str::uuid() . '.pdf';
                $path = $file->storeAs('lessons_pdfs', $fileName, 'public');
            }

            $lesson = Lesson::create([
                'titre' => $request->titre,
                'pdf_url' => $path ? '/storage/' . $path : null,
                'module_id' => $request->module_id,
                'contenu' => $request->contenu
            ]);

            if ($request->has('videos')) {
                foreach ($request->videos as $video) {
                    LessonVideo::create([
                        'video_url' => $video['video_url'],
                        'order' => $video['order'],
                        'lessons_id' => $lesson->id
                    ]);
                }
            }

            Log::info('Lesson created with videos', ['lesson_id' => $lesson->id, 'admin_id' => auth()->id()]);
            
            return response()->json($lesson->load('videos'), 201);
        });
    }

    public function update(Request $request, $id): JsonResponse
    {
        $lesson = Lesson::findOrFail($id);

        $request->validate([
            'titre' => 'sometimes|string|max:255',
            'module_id' => 'sometimes|integer|exists:modules,id',
            'contenu' => 'sometimes|nullable|string',
            'pdf_file' => 'sometimes|nullable|file|mimes:pdf|max:10240'
        ]);

        if ($request->hasFile('pdf_file')) {
            if ($lesson->pdf_url) {
                $oldPath = str_replace('/storage/', 'public/', $lesson->pdf_url);
                Storage::delete($oldPath);
            }

            $file = $request->file('pdf_file');
            $fileName = Str::uuid() . '.pdf';
            $path = $file->storeAs('lessons_pdfs', $fileName, 'public');
            $lesson->pdf_url = '/storage/' . $path;
        }

        $lesson->update($request->only(['titre', 'module_id', 'contenu']));

        Log::info('Lesson updated', ['lesson_id' => $lesson->id, 'admin_id' => auth()->id()]);

        return response()->json($lesson);
    }

    public function destroy($id): JsonResponse
    {
        $lesson = Lesson::with('videos')->findOrFail($id);

        if ($lesson->pdf_url) {
            $filePath = str_replace('/storage/', 'public/', $lesson->pdf_url);
            Storage::delete($filePath);
        }

        foreach($lesson->videos as $video) {
            $video->delete();
        }

        $lesson->delete();

        Log::info('Lesson and its videos deleted', ['lesson_id' => $id, 'admin_id' => auth()->id()]);

        return response()->json(['message' => 'Lesson deleted successfully']);
    }
}
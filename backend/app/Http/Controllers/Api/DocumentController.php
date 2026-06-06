<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Document;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Models\DocumentFile;

class DocumentController extends Controller
{
    public function index()
    {
        $documents = Document::with(['module', 'filiere', 'files'])->orderBy('created_at', 'desc')->get();
        return response()->json($documents);
    }

    public function studentIndex()
    {
        $user = auth()->user()->load('profile');
        
        $documents = Document::with(['module', 'files'])
            ->where('filiere_id', $user->profile->filiere_id)
            ->where('niveau', $user->profile->niveau)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($documents);
    }

    public function store(Request $request)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'type' => 'required|in:cc,regional,efm',
            'niveau' => 'required|integer|in:1,2',
            'year' => 'required|integer',
            'filiere_id' => 'required|exists:filieres,id',
            'module_id' => 'required|exists:modules,id',
            'file' => 'required|file|mimes:pdf|max:10240',
            'file_type' => 'required|string|in:Exercice,Correction,Cours'
        ]);

        if (!$request->hasFile('file')) {
            return response()->json(['error' => 'File is missing'], 422);
        }

        $file = $request->file('file');

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file->getRealPath());
        finfo_close($finfo);

        if ($mimeType !== 'application/pdf') {
            throw ValidationException::withMessages(['file' => 'The file must be a valid PDF']);
        }

        $fileName = Str::uuid() . '.pdf';
        $path = $file->storeAs('documents', $fileName, 'public');

        $document = Document::create([
            'titre' => $request->titre,
            'type' => $request->type,
            'niveau' => $request->niveau,
            'annee' => $request->year,
            'filiere_id' => $request->filiere_id,
            'module_id' => $request->module_id,
        ]);

        $documentFile = DocumentFile::create([
            'file_url' => '/storage/' . $path,
            'file_type' => $request->file_type,
            'document_id' => $document->id
        ]);

        return response()->json([
            'message' => 'Document and file created successfully',
            'document' => $document->load('files')
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $document = Document::with('files')->findOrFail($id);

        $request->validate([
            'titre' => 'required|string|max:255',
            'type' => 'required|in:cc,regional,efm',
            'niveau' => 'required|integer|in:1,2',
            'year' => 'required|integer',
            'filiere_id' => 'required|exists:filieres,id',
            'module_id' => 'required|exists:modules,id',
            'file' => 'nullable|file|mimes:pdf|max:10240',
            'file_type' => 'required|string|in:Exercice,Correction,Cours'
        ]);

        $document->update([
            'titre' => $request->titre,
            'type' => $request->type,
            'niveau' => $request->niveau,
            'annee' => $request->year,
            'filiere_id' => $request->filiere_id,
            'module_id' => $request->module_id,
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mimeType = finfo_file($finfo, $file->getRealPath());
            finfo_close($finfo);

            if ($mimeType !== 'application/pdf') {
                throw ValidationException::withMessages(['file' => 'The file must be a valid PDF']);
            }

            $fileName = Str::uuid() . '.pdf';
            $path = $file->storeAs('documents', $fileName, 'public');

            foreach ($document->files as $oldFile) {
                $filePath = str_replace('/storage/', '', $oldFile->file_url);
                Storage::disk('public')->delete($filePath);
                $oldFile->delete();
            }

            DocumentFile::create([
                'file_url' => '/storage/' . $path,
                'file_type' => $request->file_type,
                'document_id' => $document->id
            ]);
        } else {
            if ($document->files()->exists()) {
                $document->files()->update(['file_type' => $request->file_type]);
            }
        }

        return response()->json([
            'message' => 'Document updated successfully',
            'document' => $document->load('files')
        ], 200);
    }

    public function destroy($id)
    {
        $document = Document::with('files')->findOrFail($id);
        
        if (auth()->user()->profile->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        foreach ($document->files as $file) {
            // حل التعارض الأول: استخدام disk('public') لحذف الملف بأمان
            $filePath = str_replace('/storage/', '', $file->file_url);
            Storage::disk('public')->delete($filePath);
            $file->delete(); 
        }
        
        $document->delete();

        return response()->json(['message' => 'Document et ses fichiers supprimés avec succès']);
    }
    
    /**
     * Download a specific document file
     */
    public function downloadFile($id)
    {
        $file = DocumentFile::with('document')->findOrFail($id);

        // حل التعارض الثاني: تنظيف المسار ليتوافق مع قرص public
        $filePath = str_replace('/storage/', '', $file->file_url);

        if (!Storage::disk('public')->exists($filePath)) {
            return response()->json(['message' => 'Fichier introuvable sur le serveur'], 404);
        }

        // حل التعارض الثالث: دمج ميزة التسمية النظيفة (slug) مع التحميل عبر القرص المخصص
        $cleanTitle = Str::slug($file->document->titre, '_');
        $filename = $cleanTitle . '_' . $file->file_type . '.pdf';
        
        return Storage::disk('public')->download($filePath, $filename);
    }
}
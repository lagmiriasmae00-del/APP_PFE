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
            'message' => 'Document et fichier créés avec succès',
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
                $filePath = str_replace('/storage/', 'public/', $oldFile->file_url);
                Storage::delete($filePath);
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
            'message' => 'Document modifié avec succès',
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
            $filePath = str_replace('/storage/', 'public/', $file->file_url);
            Storage::delete($filePath);
            $file->delete(); 

        }
        
        

        $document->delete();

        return response()->json(['message' => 'Document et ses fichiers supprimés avec succès']);
    }
    

    public function downloadFile($id) //  رجعناها $id باش تطابق مع الـ Route
        {
            // 1. كنجيبو السجل بـ الـ id الصحيح
            $file = DocumentFile::with('document')->findOrFail($id);

            // 2. تحويل الـ URL لـ مسار حقيقي وسط الـ Storage
            $filePath = str_replace('/storage/', 'public/', $file->file_url);

            // 3. تأكيد وجود الملف فـ الـ Dossier الفيزيائي
            if (!Storage::exists($filePath)) {
                return response()->json(['message' => 'Fichier introuvable sur le serveur'], 404);
            }

            // 4. صناعة إسم نقي ومفهوم للملف فاش ييليشارجيه الطالب
            // مثلاً: controle_continue_numero_2_de_javascript_Exercice.pdf
            $cleanTitle = Str::slug($file->document->titre, '_');
            $filename = $cleanTitle . '_' . $file->file_type . '.pdf';
            
            // 5. تحميل الملف
            return Storage::download($filePath, $filename);
        }
}


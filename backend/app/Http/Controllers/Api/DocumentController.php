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
        // 1. Validation (حيدنا config() باش نسهلوها وتخدم ليك ديريكت بدون تعقيد)
        $request->validate([
            'titre' => 'required|string|max:255',
            'type' => 'required|in:cc,regional,efm',
            'niveau' => 'required|integer|in:1,2',
            'year' => 'required|integer',
            'filiere_id' => 'required|exists:filieres,id',
            'module_id' => 'required|exists:modules,id',
            'file' => 'required|file|mimes:pdf|max:10240', // Max 10MB
            'file_type' => 'required|string|in:Exercice,Correction,Cours' // نوع الملف المرفوع
        ]);

        if (!$request->hasFile('file')) {
            return response()->json(['error' => 'File is missing'], 422);
        }

        $file = $request->file('file');
        
        // Check real MIME type
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file->getRealPath());
        finfo_close($finfo);

        if ($mimeType !== 'application/pdf') {
            throw ValidationException::withMessages(['file' => 'The file must be a valid PDF']);
        }

        // Generate secure filename and store
        $fileName = Str::uuid() . '.pdf';
        $path = $file->storeAs('documents', $fileName, 'public');

        // 2. أولاً: إنشاء الوثيقة الأساسية (أو البحث عنها إذا كانت ديجا كاينا وبغينا نزيدو غير ملف التصحيح مثلاً)
        // هنا غانكرييوها جديدة ديريكت على حساب الفورم
        $document = Document::create([
            'titre' => $request->titre,
            'type' => $request->type,
            'niveau' => $request->niveau,
            'year' => $request->year,
            'filiere_id' => $request->filiere_id,
            'module_id' => $request->module_id,
        ]);

        // 3. ثانياً: تخزين الملف الحقيقي فـ جدول document_files وربطه بالوثيقة
        $documentFile = DocumentFile::create([
            'file_url' => '/storage/' . $path, // حفظ المسار بالطريقة اللي كيقراها التليشارجمون
            'file_type' => $request->file_type, // Exercice أو Correction
            'document_id' => $document->id
        ]);

        return response()->json([
            'message' => 'Document et fichier créés avec succès',
            'document' => $document->load('files')
        ], 201);
    }

    public function destroy($id)
    {
        $document = Document::with('files')->findOrFail($id);
        
        if (auth()->user()->profile->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // مسح كاع الملفات الفيزيائية من السيرفر قبل حذف الداتا
        foreach ($document->files as $file) {
            $filePath = str_replace('/storage/', 'public/', $file->file_url);
            Storage::delete($filePath);
            $file->delete(); // مسح من جدول document_files
        }
        
        // مسح الوثيقة من جدول documents
        $document->delete();

        return response()->json(['message' => 'Document et ses fichiers supprimés avec succès']);
    }
    

    public function downloadFile($fileId)
    {
        // 1. كنجيبو الملف بـ الـ ID ديالو
        $file = DocumentFile::with('document')->findOrFail($fileId);

        // 2. كنحولو الرابط لمسار ف السيرفر
        $filePath = str_replace('/storage/', 'public/', $file->file_url);

        if (!Storage::exists($filePath)) {
            return response()->json(['message' => 'Fichier introuvable'], 404);
        }

        // 3. التيليشارجمون باسم زوين (سمية الوثيقة + نوع الملف)
        $filename = $file->document->titre . '_' . $file->file_type . '.pdf';
        
        return Storage::download($filePath, $filename);
    }
}


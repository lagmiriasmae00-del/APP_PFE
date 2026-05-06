<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Module;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    // كيجيب كاع المواد ديال شعبة الطالب اللي مكونيكطي
   public function index()
   {
        $user = auth()->user();
        // كنجيبو غير المواد اللي عندها نفس الـ Niveau ديال الطالب ونفس الـ Filière
        // (تأكد بلي زتي خانة niveau حتى فـ جدول profiles ولا users)
        $modules = Module::where('filiere_id', $user->profile->filiere_id)
                    ->where('niveau', $user->profile->niveau) 
                    ->get();

        return response()->json($modules);
    }

    // كيجيب تفاصيل المادة (دروس وفيديوهات وامتحانات ووثائق)
    
    public function show($id)
{
    $user = auth()->user();

    // Eager Loading لجميع العلاقات باش نجيبو Package كامل
    $module = Module::with([
        'lessons.videos', // الدروس ومعاهم فيديوهاتهم
        'quizzes',        // امتحانات المادة
        'documents.files' // الوثائق (الامتحانات والملخصات) والملفات اللي وسطهم
    ])
    ->where('filiere_id', $user->profile->filiere_id)
    ->where('niveau', $user->profile->niveau)
    ->findOrFail($id);

    return response()->json($module);
}
    public function store(Request $request)
    {
        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'niveau' => 'required|integer|in:1,2,3', // كنتأكدو بلي القيمة هي 1 ولا 2 فقط
            'filiere_id' => 'required|exists:filieres,id',
        ]);

        $module = Module::create($validated);

        return response()->json([
            'message' => 'Module ajouté avec succès !',
            'module' => $module
        ], 201);
    }
        // تعديل مادة
    public function update(Request $request, $id)
    {
        $module = Module::findOrFail($id);
        $module->update($request->all());
        return response()->json(['message' => 'Module mis à jour !', 'module' => $module]);
    }

    // مسح مادة (مع الدروس ديالها أوتوماتيكياً)
    public function destroy($id)
    {
        $module = Module::findOrFail($id);
        $module->delete();
        return response()->json(['message' => 'Module supprimé !']);
    }
}

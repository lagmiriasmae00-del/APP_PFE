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
        $user = auth()->user()->load('profile');
        $filiereId = $user->profile->filiere_id;

        $modules = Module::where('filiere_id', $filiereId)
            ->withCount(['lessons', 'quizzes']) // كيحسب شحال من درس وامتحان
            ->get();

        return response()->json($modules);
    }

    // كيجيب تفاصيل المادة (دروس وفيديوهات وامتحانات ووثائق)
    public function show($id)
    {
        $module = Module::with([
            'lessons.videos', 
            'quizzes.questions.choices', // كيجيب الامتحان بأسئلته باختياراته
            'documents.files'
        ])->findOrFail($id);

        return response()->json($module);
    }
}

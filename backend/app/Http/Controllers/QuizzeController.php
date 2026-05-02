<?php

namespace App\Http\Controllers;

use App\Models\Quizze;
use Illuminate\Http\Request;

class QuizzeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Quizze $quizze)
    {
    return response()->json(
        $quizze->load('questions.choices')
        );
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(quizze $quizze)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, quizze $quizze)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(quizze $quizze)
    {
        //
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Filiere;
use Illuminate\Http\Request;

class FiliereController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Filiere::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255|unique:filieres,nom'
        ]);

        $filiere = Filiere::create([
            'nom' => $request->nom
        ]);

        return response()->json($filiere, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'nom' => 'required|string|max:255|unique:filieres,nom,' . $id
        ]);

        $filiere = Filiere::findOrFail($id);
        $filiere->update([
            'nom' => $request->nom
        ]);

        return response()->json($filiere);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $filiere = Filiere::findOrFail($id);
        $filiere->delete();

        return response()->json(['message' => 'Filière supprimée avec succès.']);
    }
}

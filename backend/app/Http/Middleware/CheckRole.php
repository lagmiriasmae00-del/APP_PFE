<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    
    
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = auth()->user();

        

        if ($user && $user->profile && in_array($user->profile->role, $roles)) {
            return $next($request);
        }

        

        return response()->json(['message' => 'Accès refusé. Vous n\'avez pas les permissions nécessaires.'], 403);
    }
}

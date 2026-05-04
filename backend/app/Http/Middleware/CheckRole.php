<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = auth()->user();

        // كنتأكدو واش المستخدم داخل واش عندو بروفايل
        if ($user && $user->profile && in_array($user->profile->role, $roles)) {
            return $next($request);
        }

        // إلا ما كانش عندو الصلاحية، كنحبسوه
        return response()->json(['message' => 'Accès refusé. Vous n\'avez pas les permissions nécessaires.'], 403);
    }
}

<?php

namespace App\Http\Middleware;

use App\Support\Roles;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (empty($roles)) {
            return $next($request);
        }

        if (! $request->user()) {
            abort(403, 'No autorizado. Usuario no autenticado.');
        }

        $userRole = $request->user()->role ?? null;

        if (! in_array($userRole, Roles::all(), true)) {
            abort(403, 'Rol de usuario desconocido.');
        }

        if (! in_array($userRole, $roles)) {
            abort(403, 'No tienes permiso para acceder a este recurso.');
        }

        return $next($request);
    }
}

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    private const ALLOWED_ROLES = ['admin', 'agente', 'cliente'];

    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (empty($roles)) {
            return $next($request);
        }

        if (! $request->user()) {
            abort(403, 'No autorizado. Usuario no autenticado.');
        }

        $userRole = $request->user()->role ?? null;

        if (! in_array($userRole, self::ALLOWED_ROLES)) {
            abort(403, 'Rol de usuario desconocido.');
        }

        if (! in_array($userRole, $roles)) {
            abort(403, 'No tienes permiso para acceder a este recurso.');
        }

        return $next($request);
    }
}

<?php

namespace App\Http\Middleware;

use Closure;

class ApiAuth
{
    /**
     * Authenticate the jwt token request
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        return $next($request);
    }
}

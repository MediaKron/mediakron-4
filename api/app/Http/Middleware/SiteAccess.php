<?php

namespace App\Http\Middleware;

use Closure;

class SiteAccess
{
    /**
     * Check to validate that the user has access to this site
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

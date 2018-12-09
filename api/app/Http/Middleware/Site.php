<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Site as SiteModel;

class Site
{
    /**
     * Validate the inbound site and add it to the request
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $site = $request->route()->parameter('site');
        $site = SiteModel::where('uri', $site)->first();
        app()->instance('App\Models\Site', $site);
        return $next($request);
    }
}

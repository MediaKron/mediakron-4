<?php 
namespace App\Http\Middleware;

use Closure;

class ContentLength {

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $response = $next($request);
        $response->header('Content-Length', strlen($response->getOriginalContent()));
        return $response;
    }
}

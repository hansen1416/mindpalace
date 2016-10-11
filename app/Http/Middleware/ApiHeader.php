<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-10-11
 * Time: 下午3:03
 */

namespace App\Http\Middleware;

use Closure;

class ApiHeader
{
    public function handle($request, Closure $next)
    {
        $response = $next($request);

        $response->header('Access-Control-Allow-Origin', config('app.allow_origin'))
                 ->header('Access-Control-Request-Method', 'GET,POST,OPTIONS');

        return $response;
    }
}
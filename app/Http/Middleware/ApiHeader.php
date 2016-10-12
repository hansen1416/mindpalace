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
        return $next($request)
            ->header('Access-Control-Allow-Origin', env('API_CLIENT_URL'))
            ->header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, X-Requested-With');
    }
}
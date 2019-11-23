<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Cache;

class CheckOnceToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $token = $request->header('once_token') ?? $request->once_token;
        $exist = Cache::get($token);
        if ($exist) {
            Cache::forget($token);
            return $next($request);
        }
        return error('用户无权限');
    }
}

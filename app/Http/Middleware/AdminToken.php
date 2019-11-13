<?php

namespace App\Http\Middleware;

use Closure;
use App\Services\Token;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class AdminToken
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
        $token = $request->header('Authorization');
        if($token == null || $token == 'null' || $token == '') {
            $token = false;
        }
        if ($token && JWTAuth::parseToken()->check()) {
            $guard = JWTAuth::parseToken()->getPayload()['role'];
            if ($guard == 'admin') {
                $response = $next($request);
                return $response;
            }
        }

        return error('无访问权限', 401);
    }
}

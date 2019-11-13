<?php

namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserToken
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
        if($token == null && $token == 'null') {
            $token == false;
        }
        if ($token && JWTAuth::parseToken()->check()) {
            $guard = JWTAuth::parseToken()->getPayload()['role'];
            if ($guard == 'user') {
                $response = $next($request);
                return $response;
            }
        }

        return error('无访问权限', 401);
    }
}

<?php

namespace App\Http\Middleware;

use Closure;
use App\Services\Token;

class SuperAdmin
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
        if(Token::user()['username'] == 'admin') {
            return $next($request);
        }
        return error('无操作权限');
    }
}

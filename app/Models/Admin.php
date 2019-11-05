<?php

namespace App\Models;

use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable implements JWTSubject
{
    protected $table = 'admins';
    protected $guarded = [];
    protected $hidden = ['password'];

    public static function boot()
    {
        parent::boot();
        static::updated(function ($model) {
            Cache::forget('admin_' . $model->id);
        });
    }

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * 额外在 JWT 载荷中增加的自定义内容
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return ['role' => 'admin'];
    }

    public static function login($credentials)
    {
        if ($token = \Auth::guard('admin')->attempt($credentials)) {
            return $token;
        }
        return false;
    }
}

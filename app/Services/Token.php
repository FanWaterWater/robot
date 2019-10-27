<?php
namespace App\Services;

use App\Utils\UserType;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class Token
{
    public static function id()
    {
        return JWTAuth::parseToken()->getPayload()['sub'];
    }

    public static function user()
    {
        $guard = JWTAuth::parseToken()->getPayload()['role'];
        return Cache::remember($guard . '_' . self::id(), 3600, function () use ($guard) {
            return Auth::guard($guard)->user();
        });
    }

    public static function userType()
    {
        $guard = JWTAuth::parseToken()->getPayload()['role'];
        $userType = UserType::ADMIN;
        switch ($guard) {
            case 'admin':
                $userType = UserType::ADMIN;
                break;
            case 'merchant':
                $userType = UserType::MERCHANT;
                break;
            case 'master':
                $userType = UserType::MASTER;
                break;
            case 'apprentice':
                $userType = UserType::APPRENTICE;
                break;
            case 'agent':
                $userType = UserType::AGENT;
                break;
            default:
                break;
        }
        return $userType;
    }
}

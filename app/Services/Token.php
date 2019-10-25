<?php
namespace App\Services;

use App\Utils\UserType;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;

class Token
{
    public static function id()
    {
        $guard = JWTAuth::parseToken()->getPayload()['role'];
        return Auth::guard($guard)->id();
    }

    public static function user()
    {
        $guard = JWTAuth::parseToken()->getPayload()['role'];
        return Auth::guard($guard)->user();
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

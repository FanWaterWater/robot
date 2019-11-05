<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;

class SmsController extends Controller
{
    public function verifyCode()
    {
        //205363
        $phone = request()->phone;
        $code = rand(100000, 999999);
        if (Cache::get('time' . $phone)) {
            return error('请勿在一分钟内重复发送');
        }
        if ($phone && \App\Services\Sms::sendVerifyCode($phone, $code)) {
            Cache::put('time' . $phone, true, 1);
            Cache::put('verify_code' . $phone, $code, 60 * 60 * 24 * 7);
            return success([], '验证码发送成功');
        }
        return error('验证码发送失败');
    }
}

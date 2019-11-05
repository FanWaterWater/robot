<?php

namespace App\Http\Controllers\Api\App;

use App\Models\User;
use App\Models\Level;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use App\Http\Requests\App\UserRequest;

class UserController extends Controller
{
    public function login(Request $request)
    {
        $credentials = request(['username', 'password']);
        $token = User::login($credentials);
        if (!$token) {
            return error('账号或密码错误');
        }
        return $this->respondWithToken($token);
    }

    /**
     * 注册
     *
     * @return \Illuminate\Http\Response
     */
    public function register(UserRequest $request)
    {
        DB::beginTransaction();
        try {
            // dd($request->verify_code);
            $data = [];
            if (Cache::get('verify_code' . $request->username) != $request->verify_code) {
                return errorMsg('验证码错误！');
            }
            $user = User::where('invite_code', $request->invite_code)->first();
            if (isset($user)) {
                $data['invite_id'] = $user->id;
            } else {
                return errorMsg('邀请码不正确！');
            }
            //TODO: 必须是手机号码,验证手机号码格式
            $data['username'] = $request->username;
            $data['password'] = bcrypt($request->password);
            $data['invite_code'] = str_random(8);
            $data['nickname'] = $request->nickname;
            $data['level_id'] = Level::getLevels()[0]['id'];
            $newUser = User::create($data);
            if ($newUser) {
                DB::commit();
                return success();
            }
        }catch(\Exception $e) {
            DB::rollback();
            return error($e->getMessage());
        }
    }

    public function forgetPassword(Request $request) {
        DB::beginTransaction();
        try {
            // dd($request->verify_code);
            if (Cache::get('verify_code' . $request->username) != $request->verify_code) {
                return errorMsg('验证码错误！');
            }
            $user = User::where('username', $request->username)->first();
            if(!isset($user)) {
                return errorMsg('用户不存在！');
            }
            $user->password = bcrypt($request->password);
            if ($user->save()) {
                DB::commit();
                return success();
            }
        }catch(\Exception $e) {
            DB::rollback();
            return error($e->getMessage());
        }
    }

    public function logout()
     {
        if(\Auth::guard('admin')->check()) {
            \Auth::guard('admin')->logout();
        }
        return success([], '登出成功');
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60,
            'user' => \Auth::guard('admin')->user(),
            'status' => 'success'
        ]);
    }
}

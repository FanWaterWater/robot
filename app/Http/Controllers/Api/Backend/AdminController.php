<?php

namespace App\Http\Controllers\Api\Backend;

use App\Models\Admin;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('superadmin')->except(['index', 'login', 'logout']);
    }

    public function index()
    {
        $pagesize = request('limit') ?? config('common.pagesize');
        $admins = Admin::paginate($pagesize);
        return success($admins);
    }

    public function show(Request $request, $id)
    {
        $admin = Admin::find($id);
        return success($admin);
    }

    public function store(Request $request)
    {
        $data = $request->all(['username', 'password']);
        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }
        if (Admin::create($data)) {
            return success();
        }
        return error();
    }

    public function update(Request $request, $id)
    {
        $data = $request->all(['username']);
        if (isset($request->password)) {
            $data['password'] = bcrypt($request->password);
        }
        if (Admin::find($id)->update($data)) {
            return success();
        }
        return error();
    }

    public function destroy(Request $request, $id)
    {
        if (Admin::find($id)->delete()) {
            return success();
        }
        return error();
    }

    public function login(Request $request)
    {
        $credentials = request(['username', 'password']);
        $token = Admin::login($credentials);
        if (!$token) {
            return error('账号或密码错误');
        }
        return $this->respondWithToken($token);
    }

    public function logout()
    {
        if (\Auth::guard('admin')->check()) {
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

<?php

namespace App\Http\Controllers\Api\Backend;

use App\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class UserController extends Controller
{
    public function index()
    {
        $pagesize = request('limit') ?? config('common.pagesize');
        $users = User::paginate($pagesize);
        return success($users);
    }

    public function show(Request $request, $id)
    {
        $user = User::find($id);
        return success($user);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        if(isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }
        if (User::create($data)) {
            return success();
        }
        return error();
    }

    public function update(Request $request, $id)
    {
        $data = $request->all();
        if(isset($request->password)) {
            $data['password'] = bcrypt($request->password);
        }
        if (User::find($id)->update($data)) {
            return success();
        }
        return error();
    }

    public function destroy(Request $request, $id)
    {
        if (User::find($id)->delete()) {
            return success();
        }
        return error();
    }
}

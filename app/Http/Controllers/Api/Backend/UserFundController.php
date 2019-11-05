<?php

namespace App\Http\Controllers\Api\Backend;

use App\Models\User;
use App\Models\UserFund;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class UserFundController extends Controller
{
    public function index(Request $request)
    {
        $pagesize = $request->limit ?? config('common.pagesize');
        $type = $request->type ?? -1;
        $id = $request->id ?? -1;
        $startDate = $request->startDate;
        $endDate = $request->endDate ? $request->endDate . ' 23:59:59' : null;
        $userId = -1;
        if($request->username) {
            $user = User::where('username', $request->username)->first(['id']);
            $userId = isset($user) ? $user->id : 0;
        }
        $funds = UserFund::when($id > -1, function ($query) use ($id) {
            return $query->where('id', $id);
        })->when($userId > -1, function ($query) use ($userId) {
            return $query->where('user_id', $userId);
        })->when($type > -1, function ($query) use ($type) {
            return $query->where('type', $type);
        })->when($startDate, function ($query) use ($startDate) {
            return $query->where('created_at', '>=', $startDate);
        })->when($endDate, function ($query) use ($endDate) {
            return $query->where('created_at', '<=', $endDate);
        })->with('user:id,username')->orderBy('id', 'desc')->paginate($pagesize);
        return success($funds);
    }
}

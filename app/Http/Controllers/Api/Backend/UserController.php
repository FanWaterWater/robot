<?php

namespace App\Http\Controllers\Api\Backend;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Redis;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->limit;
        $username = $request->username;
        $userId = $request->user_id;
        $levelId = $request->level_id;
        $nickname = $request->nickname;
        $recommend = $request->recommend;
        $status = $request->status;
        $startDate = $request->startDate;
        $endDate = $request->endDate ? $request->endDate . ' 23:59:59' : null;;
        $orderBy = $request->orderBy ? 'asc' : 'desc';
        $users = User::when($username, function ($query) use ($username) {
            return $query->where('username', 'like', '%' . $username . '%');
        })->when($nickname, function ($query) use ($nickname) {
            return $query->where('nickname', 'like', '%' . $nickname . '%');
        })->when($userId > 0, function ($query) use ($userId) {
            return $query->where('id', $userId);
        })->when($levelId > 0, function ($query) use ($levelId) {
            return $query->where('level_id', $levelId);
        })->when($status > 0, function ($query) use ($status) {
            return $query->where('status', $status);
        })->when($recommend > 0, function ($query) use ($recommend) {
            return $query->where('invite_id', $recommend);
        })->when($startDate, function ($query) use ($startDate) {
            return $query->where('created_at', '>=', $startDate);
        })->when($endDate, function ($query) use ($endDate) {
            return $query->where('created_at', '<=', $endDate);
        })->with(['level', 'recommend'])->orderBy('created_at', $orderBy)->paginate($limit);

        foreach ($users as &$user) {
            $user->direct_user_count = Redis::scard('direct_user'. $user->id) ?? 0;
            $user->indirect_user_count = Redis::scard('indirect_user'. $user->id) ?? 0;
            $user->teamCount = Redis::scard('team_user'. $user->id) ?? 0;
        }
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

    /**
     * 修改会员等级
     *
     * @param Request $request
     * @param int $id
     * @return void
     */
    public function changeLevel(Request $request)
    {
        $data = $request->all();
        if (User::where('id', $request->id)->update($data)) {
            return success();
        }
        return error();
    }

    /**
     * 修改会员状态
     *
     * @param Request $request
     * @return void
     */
    public function changeStatus(Request $request)
    {
        $data = $request->all();
        if (User::where('id', $request->id)->update($data)) {
            return success();
        }
        return error();
    }

    public function export(Request $request)
    {
        $phone = $request->phone;
        $userId = $request->user_id;
        $levelId = $request->level_id;
        $nickname = $request->nickname;
        $status = $request->status;
        $recommend = $request->recommend;
        $startDate = $request->startDate;
        $endDate = $request->endDate ? $request->endDate . ' 23:59:59' : null;;
        $orderBy = $request->orderBy ? 'asc' : 'desc';
        $realname = $request->realname > 0 ? true : false;
        $users = User::when($phone, function ($query) use ($phone) {
            return $query->where('phone', 'like', '%' . $phone . '%');
        })->when($nickname, function ($query) use ($nickname) {
            return $query->where('nickname', 'like', '%' . $nickname . '%');
        })->when($userId > 0, function ($query) use ($userId) {
            return $query->where('id', $userId);
        })->when($levelId > 0, function ($query) use ($levelId) {
            return $query->where('level_id', $levelId);
        })->when($status > 0, function ($query) use ($status) {
            return $query->where('status', $status);
        })->when($recommend > 0, function ($query) use ($recommend) {
            return $query->where('team_id', $recommend);
        })->when($startDate, function ($query) use ($startDate) {
            return $query->where('created_at', '>=', $startDate);
        })->when($endDate, function ($query) use ($endDate) {
            return $query->where('created_at', '<=', $endDate);
        })->when($realname, function ($query) {
            return $query->where('realname_verify_id', '>', 0);
        })->with(['level', 'transactionSetting', 'realname', 'recommend'])->orderBy('created_at', $orderBy)->get();

        $data = [];

        $title = ['ID', '昵称', '头像', '手机号码', '等级', '实名认证', '微信付款码', '支付宝付款码', '推荐人', '状态', '积分', '矿池', '可售五行石', '可投五行石', '可用余额', '已提余额', '钱包总收益', '创建时间', '更新时间'];

        array_push($data, $title);

        foreach ($users as &$user) {
            if ($user->status == 0) {
                $user->status = '正常';
            } else {
                $user->status = '冻结';
            }
            if ($user->realname_verify_id == 0) {
                $user->realname_verify_id = '未认证';
            } else {
                $user->realname_verify_id = '已认证';
            }
            if(!$user->transactionSetting) {
                $wechatPay = '未设置';
                $alipay = '未设置';
            }else {
                $wechatPay = $user->transactionSetting->wechat_pay;
                $alipay = $user->transactionSetting->alipay;
            }

            if(!$user->recommend) {
                $recommend = '未设置';
            }else {
                $recommend = $user->recommend->nickname . '(' . $user->recommend->phone .')';
            }
            array_push($data, [$user->id, $user->nickname, $user->avatar, $user->phone, $user->level->name, $user->realname_verify_id, $wechatPay, $alipay, $recommend, $user->status, $user->integral, $user->mine_pool, $user->available_stone, $user->put_in_stone, $user->available_balance, $user->used_balance, $user->money, $user->created_at, $user->updated_at]);
        }

        $name = '会员记录';

        LaravelExcel::export($name, $data);
    }
}

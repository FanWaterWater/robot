<?php

namespace App\Http\Controllers\Api\Backend;

use App\Models\User;
use App\Models\Robot;
use App\Utils\FundType;
use App\Models\Headline;
use App\Models\UserFund;
use App\Models\BankAccount;
use Illuminate\Http\Request;
use App\Models\AlipayAccount;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;
use App\Http\Requests\App\UserRequest;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->limit;
        $username = $request->username;
        $userId = $request->user_id;
        $levelId = $request->level_id;
        $nickname = $request->nickname;
        $sort = $request->sort;
        $sortBy = 'id';
        $recommendId = -1;
        if (isset($request->recommend)) {
            $recommend = User::where('username', $request->recommend)->first(['id']);
            $recommendId = isset($recommend) ? $recommend->id : 0;
        }
        $status = $request->status;
        $startDate = $request->startDate;
        $endDate = $request->endDate ? $request->endDate . ' 23:59:59' : null;;
        $orderBy = $request->orderBy ? 'asc' : 'desc';
        $userIds = null;
        $count = 0;
        if ($sort) {
            if (in_array($sort, ['direct_user', 'indirect_user', 'team_user', 'robot', 'team_robot'])) {
                $startOffset = ($request->page - 1) * $limit;
                $endOffset = $request->page * $limit;
                if ($request->orderBy) {
                    $userIds = Redis::zrevrange($sort, $startOffset, $endOffset);
                } else {
                    $userIds = Redis::zrange($sort, $startOffset, $endOffset);
                }
                $count = Redis::zcard($sort);
            } else if (in_array($sort, ['amount', 'amount_total'])) {
                $sortBy = $sort;
            }
        }
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
        })->when($recommendId > -1, function ($query) use ($recommendId) {
            return $query->where('invite_id', $recommendId);
        })->when($startDate, function ($query) use ($startDate) {
            return $query->where('created_at', '>=', $startDate);
        })->when($endDate, function ($query) use ($endDate) {
            return $query->where('created_at', '<=', $endDate);
        })->when($userIds, function ($query) use ($userIds) {
            return $query->whereIn('id', $userIds);
        })->with(['level:id,name,income_reward', 'recommend:id,username', 'alipay',  'bank'])->orderBy($sortBy, $orderBy)->paginate($limit);
        $config = Cache::get('robot_config');
        foreach ($users as &$user) {
            $user->direct_users_count = Redis::scard('direct_user' . $user->id);
            $user->indirect_users_count = Redis::scard('indirect_user' . $user->id);
            $user->team_users_count = Redis::scard('team_user' . $user->id) + $user->direct_users_count +  $user->indirect_users_count;
            $user->robots_count = Redis::scard('robot' . $user->id) ?? 0;
            // $user->direct_robots_count = Redis::scard('direct_robot' . $user->id) ?? 0;
            // $user->indirect_robots_count = Redis::scard('indirect_robot' . $user->id) ?? 0;
            $user->team_robots_count = Redis::scard('team_robot_total' . $user->id) ?? 0;
            $todayIncome = 0;
            $income = $config['income'];
            if ($config['income_switch'] == 1) {
                $todayIncome = Redis::scard('today_robot' . $user->id) * $income + Redis::scard('today_direct_robot' . $user->id) * ($user->level->income_reward['direct'] / 100 * $income) + Redis::scard('today_indirect_robot' . $user->id) * ($user->level->income_reward['indirect'] / 100 * $income) + Redis::scard('day_team_robot' . $user->id) * ($user->level->income_reward['team'] / 100 * $income);
            }
            $reward = UserFund::where('type', FundType::INVITE_INCOME)->whereDate('created_at', date('Y-m-d'))->where('user_id', $user->id)->sum('change_amount');
            $todayIncome += $reward;
            $user->today_income = $todayIncome;
        }
        if ($sort) {
            if (in_array($sort, ['direct_user', 'indirect_user', 'team_user', 'robot', 'team_robot'])) {
                $sortBy = $sort . 's_count';
                $user->total = $count;
                if ($request->orderBy) {
                    $users->data = $users->sortBy($sortBy);
                } else {
                    $users->data = $users->sortByDesc($sortBy);
                }
            }
        }

        return success($users);
    }

    public function show(Request $request, $id)
    {
        $user = User::with(['level:id,name', 'recommend:id,username', 'alipay', 'bank'])->find($id);
        return success($user);
    }

    public function store(UserRequest $request)
    {
        $data = $request->all();
        if (isset($data['recommend'])) {
            $user = User::where('username', $data['recommend'])->first(['id']);
            if (isset($user)) {
                $data['invite_id'] = $user->id;
            } else {
                return error('推荐人不存在', 200, 400);
            }
        }
        unset($data['recommend'], $data['alipay_account_name'], $data['alipay_account'], $data['bank_name'], $data['bank_account_name'], $data['bank_account']);
        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }
        $data['nickname'] = $data['nickname'] ?? str_random(8);
        // $data['invite_code'] = str_random(8);
        if (User::create($data)) {
            return success();
        }
        return error();
    }

    public function update(Request $request, $id)
    {
        $data = $request->all();
        $recommend = User::where('username', $data['recommend'])->first(['id']);
        if (isset($recommend)) {
            $data['invite_id'] = $recommend->id;
        } else {
            return error('推荐人不存在', 200, 400);
        }
        if (isset($request->password)) {
            $data['password'] = bcrypt($request->password);
        }
        $user = User::find($id);
        if ($user->alipay_account_id > 0 && (isset($data['alipay_account_name']) || isset($data['alipay_account']))) {
            AlipayAccount::where('id', $user->alipay_account_id)->update([
                'name' => $data['alipay_account_name'],
                'account' => $data['alipay_account']
            ]);
        }
        if ($user->bank_account_id > 0 && (isset($data['bank_name']) || isset($data['bank_account_name']) || isset($data['bank_account']))) {
            BankAccount::where('id', $user->bank_account_id)->update([
                'bank' => $data['bank_name'],
                'name' => $data['bank_account_name'],
                'account' => $data['bank_account'],
            ]);
        }
        unset($data['recommend'], $data['alipay_account_name'], $data['alipay_account'], $data['bank_name'], $data['bank_account_name'], $data['bank_account']);
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

    public function giftRobot(Request $request)
    {
        $num = $request->num;
        $userId = $request->id;
        if ((Redis::scard('robot' . $userId) +  $num) > Cache::get('system_config')['ROBOT_LIMIT']) {
            return error('用户机器数量达到上限，该用户已持有' . Redis::scard('robot' . $request->id) . '台机器');
        }
        DB::beginTransaction();
        try {
            for ($i = 0; $i < $num; $i++) {
                Robot::add($userId, 2);
            }
            $user = User::find($userId);
            $fund = [
                'user_id' => $userId,
                'type' => FundType::BUY_ROBOT,
                'change_amount' => $num,
                'after_amount' => $user->amount,
                'content' =>  '用户购买' . $num . '台机器',
                'remark' => '购买激活机器',
            ];
            UserFund::create($fund);
            $headline = [
                'content' => '🎉🎉🎉' . $user->nickname . '购买了' . $num . '台机器',
            ];
            Headline::create($headline);
            DB::commit();
            return success();
        } catch (\Exception $e) {
            DB::rollback();
            return error();
        }
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
        })->with(['level', 'transactionSetting', 'realname', 'recommend'])->orderBy('id', $orderBy)->get();

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
            if (!$user->transactionSetting) {
                $wechatPay = '未设置';
                $alipay = '未设置';
            } else {
                $wechatPay = $user->transactionSetting->wechat_pay;
                $alipay = $user->transactionSetting->alipay;
            }

            if (!$user->recommend) {
                $recommend = '未设置';
            } else {
                $recommend = $user->recommend->nickname . '(' . $user->recommend->phone . ')';
            }
            array_push($data, [$user->id, $user->nickname, $user->avatar, $user->phone, $user->level->name, $user->realname_verify_id, $wechatPay, $alipay, $recommend, $user->status, $user->integral, $user->mine_pool, $user->available_stone, $user->put_in_stone, $user->available_balance, $user->used_balance, $user->money, $user->created_at, $user->updated_at]);
        }

        $name = '会员记录';

        LaravelExcel::export($name, $data);
    }
}

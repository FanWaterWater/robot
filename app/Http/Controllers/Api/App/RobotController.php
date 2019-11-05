<?php

namespace App\Http\Controllers\Api\App;

use App\Models\User;
use App\Models\Robot;
use App\Services\Token;
use App\Utils\FundType;
use App\Models\UserFund;
use App\Models\RobotCode;
use App\Models\RobotOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;

class RobotController extends Controller
{
    public function index()
    {
        $userId = request('user_id');
        // $userId = Token::id();
        $user = User::with('level:id,income_reward')->find($userId);
        $robotCount = Redis::scard('robot' . $userId);
        $config = Cache::get('robot_config');
        //计算今日收益
        $todayIncome = 0;
        $income = $config['income'];
        if ($config['income_switch'] == 1) {
            $todayIncome = Redis::scard('today_robot' . $userId) * $income + Redis::scard('today_direct_robot' . $user->id) * ($user->level->income_reward['direct'] / 100 * $income) + Redis::scard('today_indirect_robot' . $user->id) * ($user->level->income_reward['indirect'] / 100 * $income) + Redis::scard('day_team_robot' . $user->id) * ($user->level->income_reward['team'] / 100 * $income);
        }
        $reward = UserFund::where('type', FundType::INVITE_INCOME)->whereDate('created_at', date('Y-m-d'))->where('user_id', $userId)->sum('change_amount');
        $todayIncome += $reward;
        $data = [
            'robotCount' => $robotCount,
            'todayIncome' => number_format($todayIncome, 2),
            'availableIncome' => $user->amount,
            'totalIncome' => $user->amount_total
        ];
        return success($data);
    }

    /**
     * 购买
     *
     * @return void
     */
    public function buy()
    {
        $userId = Token::id();
        $order = RobotOrder::create([
            'order_no' => getOrderNo(),
            'user_id' => $userId,
            'price' => Cache::get('robot_config')['price'],
            'status' => 0
        ]);
        return success($order);
    }

    /**
     * 激活
     *
     * @return void
     */
    public function activate(Request $request)
    {
        // $userId = Token::id();
        $userId = $request->user_id;

        $code = $request->code;
        DB::beginTransaction();  //开启事务
        try {
            $code = RobotCode::where('code', $code)->first();
            if (isset($code) && $code->status == 0) {
                $orderNo = getOrderNo();
                $fund = [
                    'user_id' => $userId,
                    'type' => FundType::BUY_ROBOT,
                    'change_amount' => 0,
                    'after_amount' => Token::user()['amount'],
                    'content' => '用户使用激活码(' . $code->code . ')开通机器(编号：' . $orderNo . ')',
                    'remark' => '激活机器',
                ];
                UserFund::create($fund);
                $robot = Robot::add($userId);
                $code->user_id = $userId;
                $code->status = 1;
                $code->robot_id = $robot->id;
                $code->save();
            } else {
                return errorMsg('激活码无效！');
            }
            DB::commit();
            return success();
        } catch (\Exception $e) {
            DB::rollback();
            return error($e->getMessage());
        }
    }
}

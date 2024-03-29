<?php

namespace App\Http\Controllers\Api\App;

use App\Models\User;
use App\Models\Robot;
use Yansongda\Pay\Pay;
use App\Services\Token;
use App\Utils\FundType;
use App\Models\UserFund;
use App\Models\RobotCode;
use App\Models\RobotOrder;
use App\Models\RobotConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;
use Symfony\Component\HttpFoundation\Response;
use Carbon\Carbon;
use App\Models\Headline;


class RobotController extends Controller
{
    public function index()
    {
        $userId = Token::id();
        $user = User::with('level:id,income_reward')->find($userId);
        $robotCount = Redis::scard('robot' . $userId);
        $config = Cache::get('robot_config');
        //计算今日收益
        $todayIncome = 0;
        // $income = $config['income'];
        // if ($config['income_switch'] == 1) {
        //     $todayIncome = Redis::scard('today_robot' . $userId) * $income + Redis::scard('today_direct_robot' . $user->id) * ($user->level->income_reward['direct'] / 100 * $income) + Redis::scard('today_indirect_robot' . $user->id) * ($user->level->income_reward['indirect'] / 100 * $income) + Redis::scard('day_team_robot' . $user->id) * ($user->level->income_reward['team'] / 100 * $income);
        // }
        $todayIncome = UserFund::where('type', FundType::ROBOT_INCOME)->whereDate('created_at', date('Y-m-d'))->where('user_id', $userId)->sum('change_amount');
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
     * 获取列表
     *
     * @return void
     */
    public function list(Request $request)
    {
        $type = $request->type;
        if ($type == 0) {
            $robots = Robot::where('user_id', Token::id())->orderBy('id', 'desc')->paginate(config('common.pagesize'));
        } else {
            $robots = Robot::onlyTrashed()->where('user_id', Token::id())->orderBy('id', 'desc')->paginate(config('common.pagesize'));
        }
        return success($robots);
    }

    /**
     * 获取配置
     *
     * @return void
     */
    public function config()
    {
        $config = RobotConfig::whereDate('date', date('Y-m-d'))->first();
        return success($config);
    }

    /**
     * 购买
     *
     * @return void
     */
    public function buy(Request $request)
    {
        $userId = Token::id();
        $num = $request->num;
        $robotCount = Redis::scard('robot' . $userId);
        if (($robotCount + $num) >= Cache::get('system_config')['ROBOT_LIMIT']) {
            return error('持有机器已到上限,您还可购买' . (Cache::get('system_config')['ROBOT_LIMIT'] - $robotCount) . '台机器');
        }
        $order = RobotOrder::create([
            'order_no' =>  getOrderNo(),
            'user_id' => $userId,
            'num' => $num,
            'price' => Cache::get('robot_config')['price'] * $num,
            'status' => 0
        ]);
        return success($order);
        // return Pay::alipay($config)->wap($aliPayOrder);
    }

    /**
     * 激活
     *
     * @return void
     */
    public function activate(Request $request)
    {
        //0点到0：30维护
        if (date('H') == 0 && date('i') < 30) {
            return error('0:00~0:30为机器收益系统结算期间，请稍后再来');
        }
        $userId = Token::id();
        $robotCount = Redis::scard('robot' . $userId);
        if ($robotCount >= Cache::get('system_config')['ROBOT_LIMIT']) {
            return error('持有机器已到上限');
        }
        $code = $request->code;
        DB::beginTransaction();  //开启事务
        try {
            $code = RobotCode::where('code', $code)->first();
            if (isset($code) && $code->status == 0) {
                $robot = Robot::add($userId, 1);
                $fund = [
                    'user_id' => $userId,
                    'type' => FundType::BUY_ROBOT,
                    'change_amount' => 1,
                    'after_amount' => Token::user()['amount'],
                    'content' => '用户使用激活码(' . $code->code . ')激活机器(编号：' . $robot->robot_no . ')',
                    'remark' => '激活码激活机器',
                ];
                UserFund::create($fund);
                $headline = [
                    'content' => Token::user()['nickname'] . '激活了1台机器',
                ];
                Headline::create($headline);
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

<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Robot;
use App\Utils\FundType;
use App\Models\Headline;
use App\Models\UserFund;
use App\Models\RobotOrder;
use Illuminate\Http\Request;
use App\Services\AlipayNotify;
use App\Services\AlipaySubmit;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpFoundation\Response;

class MgopayController extends Controller
{
    public function pay(Request $request)
    {
        $order = RobotOrder::where('order_no', $request->order_no)->first();
        if (!isset($order)) {
            return error('订单号错误');
        }
        $config = config('mgopay');
        $notify_url = "https://" . $_SERVER['HTTP_HOST'] . "/api/mgopay/notify";
        //需http://格式的完整路径，不能加?id=123这类自定义参数
        //页面跳转同步通知页面路径
        $return_url = "https://" . $_SERVER['HTTP_HOST'] . "/mobile/paySuccess.html";
        //需http://格式的完整路径，不能加?id=123这类自定义参数，不能写成http://localhost/
        //商户订单号
        $out_trade_no = $order->order_no;
        //商户网站订单系统中唯一订单号，必填
        //支付方式
        // $type = $_POST['type'];
        $type = $request->type;
        //商品名称
        $name = '购买机器';
        //付款金额
        $money = $order->price;
        //站点名称
        $sitename = '刷脸易付';

        $parameter = array(
            "pid" => trim($config['partner']),
            "type" => $type,
            "notify_url"    => $notify_url,
            "return_url"    => $return_url,
            "out_trade_no"    => $out_trade_no,
            "name"    => $name,
            "money"    => $money,
            "sitename"    => $sitename
        );
        $alipaySubmit = new AlipaySubmit($config);
        $html_text = $alipaySubmit->buildRequestForm($parameter);
        return Response::create($html_text);
    }

    public function notify(Request $request)
    {
        $config = config('mgopay');
        $alipayNotify = new AlipayNotify($config);
        $verify_result = $alipayNotify->verifyNotify();
        if ($verify_result) { //验证成功
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //请在这里加上商户的业务逻辑程序代
            //——请根据您的业务逻辑来编写程序（以下代码仅作参考）——
            //获取支付宝的通知返回参数，可参考技术文档中服务器异步通知参数列表
            //交易状态
            if ($request['trade_status'] == 'TRADE_SUCCESS') {
                \Log::info('TRADE_SUCCESS');
                $order = RobotOrder::where('order_no', $request['out_trade_no'])->first();
                if (isset($order) && $order->status == 0) {

                    DB::beginTransaction();  //开启事务
                    try {
                        $order->trade_no = $request['trade_no'];  //SAF易支付交易号
                        $order->pay_way = $request['type'];  //支付方式
                        $order->status = 1;
                        $order->save();
                        $num = $order->num;
                        $userId = $order->user_id;
                        $user = User::find($userId);
                        \Log::info('user');

                        for ($i = 0; $i < $num; $i++) {
                            Robot::add($userId, 0);
                        }
                        \Log::info('Robot');

                        $fund = [
                            'user_id' => $userId,
                            'type' => FundType::BUY_ROBOT,
                            'change_amount' => 0,
                            'after_amount' => $user->amount,
                            'content' => '用户购买' . $num . '台机器',
                            'remark' => '购买激活机器',
                        ];
                        UserFund::create($fund);
                        \Log::info('UserFund');

                        $headline = [
                            'content' => $user->nickname . '购买了' . $num . '台机器',
                        ];
                        Headline::create($headline);
                        \Log::info('Headline');

                        DB::commit();
                    } catch (\Exception $e) {
                        DB::rollback();
                    }
                }
            }
            //——请根据您的业务逻辑来编写程序（以上代码仅作参考）——

            return "success";        //请不要修改或删除
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        } else {
            //验证失败
            return "fail";
        }
    }
}

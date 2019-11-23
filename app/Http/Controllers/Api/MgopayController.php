<?php

namespace App\Http\Controllers\Api;

use App\Models\RobotOrder;
use Illuminate\Http\Request;
use App\Services\AlipayNotify;
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
        $alipaySubmit = new \App\Services\AlipaySubmit($config);
        $html_text = $alipaySubmit->buildRequestForm($parameter);
        return Response::create($html_text);
    }

    public function notify(Request $request)
    {
        \Log::info($request);

        $config = config('mgopay');
        $alipayNotify = new AlipayNotify($config);
        $verify_result = $alipayNotify->verifyNotify();
        if ($verify_result) { //验证成功
            \Log::info('验证成功');

            return "success";        //请不要修改或删除

            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //请在这里加上商户的业务逻辑程序代
            //——请根据您的业务逻辑来编写程序（以下代码仅作参考）——
            //获取支付宝的通知返回参数，可参考技术文档中服务器异步通知参数列表
            //商户订单号
            $out_trade_no = $request->out_trade_no;
            //SAF易支付交易号
            $trade_no = $request->trade_no;
            //交易状态
            $trade_status = $request->trade_status;
            //支付方式
            $type = $request->type;
            if ($_GET['trade_status'] == 'TRADE_SUCCESS') {
                $order = RobotOrder::where('order_no', $request->out_trade_no)->first();
                if ($request->trade_status == 'TRADE_SUCCESS' && $request->notify_type == 'trade_status_sync' && isset($order) && $order->status == 0) {
                    DB::beginTransaction();  //开启事务
                    try {
                        $order->trade_no = $request->trade_no;
                        $order->pay_way = $request->type;
                        $order->gmt_payment = $request->gmt_payment;
                        $order->status = 1;
                        $order->save();
                        $userId = $order->user_id;
                        $user = User::find($userId);
                        $robot = Robot::add($userId);
                        $fund = [
                            'user_id' => $userId,
                            'type' => FundType::BUY_ROBOT,
                            'change_amount' => 0,
                            'after_amount' => $user->amount,
                            'content' => '用户购买机器(编号：' . $robot->robot_no . ')',
                            'remark' => '购买激活机器',
                        ];
                        UserFund::create($fund);
                        DB::commit();
                    } catch (Exception $e) {
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

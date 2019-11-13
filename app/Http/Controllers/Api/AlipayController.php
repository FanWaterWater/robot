<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Level;
use Yansongda\Pay\Pay;
use App\Utils\VipIndex;
use App\Models\RobotOrder;
use App\Models\VipRecord;
use App\Models\UserRecharge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\AlipayVerifyOrder;

class AlipayController extends Controller
{
    public function pay(Request $request)
    {
        $order = RobotOrder::where('order_no', $request->order_no)->first();
        $aliPayOrder = [
            'out_trade_no' => $order->order_no,
            'total_amount' => $order->price, // 支付金额
            'subject'      => $request->subject ?? '开通会员' // 备注
        ];
        $payId = mt_rand(1, 2);
        $config = config('alipay.pay' . $payId);
        return Pay::alipay($config)->wap($aliPayOrder);
    }

    public function notify(Request $request)
    {
        $configs = config('alipay');
        $config = [];
        foreach ($configs as $value) {
            if ($value['app_id'] == $request->app_id) {
                $config = $value;
            }
        }
        $alipay = Pay::alipay($config);
        $verify = $alipay->verify();
        if (isset($verify)) {
            $order = RobotOrder::where('order_no', $request->out_trade_no)->first();
            if ($request->trade_status == 'TRADE_SUCCESS' && $request->notify_type == 'trade_status_sync' && isset($order) && $order->status == 0) {
                DB::beginTransaction();  //开启事务
                try {
                    $order->trade_no = $request->trade_no;
                    $order->app_id = $request->app_id;
                    $order->gmt_payment = $request->gmt_payment;
                    $order->status = 1;
                    $order->save();
                    $userId = $order->user_id;
                    $recharge = [
                        'user_id' => $userId,
                        'price' =>  $order->price,
                        'order_no' => $order->order_no,
                        'remark' => '用户开通会员',
                    ];
                    UserRecharge::create($recharge);
                    VipRecord::add($userId, 0, $order->order_no);
                    User::teamOpenVipReward($userId);
                    DB::commit();
                } catch (Exception $e) {
                    DB::rollback();
                }
            }

            if ($request->trade_status == 'TRADE_CLOSED') {
                \Log::info('交易关闭');
            }
            \Log::info('订单编号:' . $request->out_trade_no);
        }

        return $alipay->success();
    }

    public function verifyPay(Request $request)
    {
        $order = AlipayVerifyOrder::where('order_no', $request->order_no)->first();
        $aliPayOrder = [
            'out_trade_no' => $order->order_no,
            'total_amount' => $order->price, // 支付金额
            'subject'      => $request->subject ?? '支付宝支付认证' // 备注
        ];
        $payId = mt_rand(1, 2);
        $config = config('alipay.pay' . $payId);
        $config['notify_url'] = 'https://dawnll.com/alipay/verify-notify';
        return Pay::alipay($config)->wap($aliPayOrder);
    }


    public function verifyNotify(Request $request)
    {
        $configs = config('alipay');
        $config = [];
        foreach ($configs as $value) {
            if ($value['app_id'] == $request->app_id) {
                $config = $value;
            }
        }
        $alipay = Pay::alipay($config);
        $verify = $alipay->verify();
        if (isset($verify)) {
            $order = AlipayVerifyOrder::where('order_no', $request->out_trade_no)->first();
            if ($request->trade_status == 'TRADE_SUCCESS' && $request->notify_type == 'trade_status_sync' && isset($order) && $order->status == 0) {
                DB::beginTransaction();  //开启事务
                try {
                    $order->trade_no = $request->trade_no;
                    $order->app_id = $request->app_id;
                    $order->gmt_payment = $request->gmt_payment;
                    $order->buyer_id = $request->buyer_id;
                    $order->status = 1;
                    $alipayVerifyOrder = AlipayVerifyOrder::where('buyer_id', $request->buyer_id)->first();
                    if(isset($alipayVerifyOrder)) {
                        $order->repeat_status = 1;  //判断是否重复实名
                    } else {
                        \Log::info('账号重复认证:' . $request->out_trade_no);
                    }
                    $order->save();
                    DB::commit();
                } catch (Exception $e) {
                    DB::rollback();
                }
            }

            if ($request->trade_status == 'TRADE_CLOSED') {
                \Log::info('交易关闭');
            }
            \Log::info('订单编号:' . $request->out_trade_no);
        }

        return $alipay->success();
    }
}

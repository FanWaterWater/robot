<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\RobotOrder;

class MgopayController extends Controller
{
    public function pay(Request $request)
    {
        $order = RobotOrder::where('order_no', $request->order_no)->first();
        if (!isset($order)) {
            return error('订单号错误');
        }
        $config = config('mgopay');
        $notify_url = "https://" . $_SERVER['HTTP_HOST'] . "/mgopay/notify";
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

    public function notify()
    {
        \Log::info('收到通知');
    }
}

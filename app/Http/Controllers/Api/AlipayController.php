<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Level;
use App\Models\Robot;
use Yansongda\Pay\Pay;
use App\Utils\FundType;
use App\Utils\VipIndex;
use App\Models\UserFund;
use App\Models\VipRecord;
use App\Models\RobotOrder;
use App\Models\UserRecharge;
use Illuminate\Http\Request;
use App\Models\AlipayVerifyOrder;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class AlipayController extends Controller
{
    public function pay(Request $request)
    {
        $order = RobotOrder::where('order_no', $request->order_no)->first();
        $aliPayOrder = [
            'out_trade_no' => $order->order_no,
            'total_amount' => $order->price, // 支付金额
            'subject'      => '开通会员' // 备注
        ];
        $payId = 2;
        $config = config('alipay.pay' . $payId);
        return Pay::alipay($config)->wap($aliPayOrder);
    }

    public function notify(Request $request)
    {
        \Log::info($request);
        $configs = config('alipay');
        $config = [];
        foreach ($configs as $value) {
            if ($value['app_id'] == $request->app_id) {
                $config = $value;
            }
        }
        $alipay = Pay::alipay($config);
        $verify = $alipay->verify();
        \Log::info($verify);
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

            if ($request->trade_status == 'TRADE_CLOSED') {
                \Log::info('交易关闭');
            }
            \Log::info('订单编号:' . $request->out_trade_no);
        }

        return $alipay->success();
    }

    public function getSn()
    {
        // $filepath /Users/lishiwei/Downloads
        $filepath = request()->file('file');
        $fileData = file_get_contents($filepath);
        $isroot = request('isroot');
        if ($isroot == 'true') {
            return $this->getRootCertSN($fileData);
        } else {
            return $this->getCertSN($fileData);
        }
        // return $md5_str;
    }

    public function getRootCertSN($str)
    {
        // return '687b59193f3f462dd5336e5abf83c5d8_02941eef3187dddf3d3b83462e1dfcf6';
        $arr = preg_split('/(?=-----BEGIN)/', $str, -1, PREG_SPLIT_NO_EMPTY);
        $str = null;
        foreach ($arr as $e) {
            $sn = $this->getCertSN($e, true);
            if (!$sn) {
                continue;
            }
            if ($str === null) {
                $str = $sn;
            } else {
                $str .= "_" . $sn;
            }
        }
        return $str;
    }

    public function getCertSN($str, $matchAlgo = false)
    {
        /*
    根据java SDK源码：AntCertificationUtil::getRootCertSN
    对证书链中RSA的项目进行过滤（猜测是gm国密算法java抛错搞不定，故意略去）
    java源码为：

    if(c.getSigAlgOID().startsWith("1.2.840.113549.1.1"))

    根据 https://www.alvestrand.no/objectid/1.2.840.113549.1.1.html
    该OID为RSA算法系。
     */
        if ($matchAlgo) {
            openssl_x509_export($str, $out, false);
            if (!preg_match('/Signature Algorithm:.*?RSA/im', $out, $m)) {
                return;
            }
        }
        $a = openssl_x509_parse($str);
        $issuer = null;
        // 注意：根据java代码输出，需要倒着排列 CN,OU,O
        foreach ($a["issuer"] as $k => $v) {
            if ($issuer === null) {
                $issuer = "$k=$v";
            } else {
                $issuer = "$k=$v," . $issuer;
            }
        }
        #    echo($issuer . $a["serialNumber"] . "\n");
        $serialNumberHex = $this->decimalNotation($a['serialNumberHex']);
        $sn = md5($issuer . $serialNumberHex);
        return $sn;
    }

    function decimalNotation($hex)
    {
        $dec = 0;
        $len = strlen($hex);
        for ($i = 1; $i <= $len; $i++) {
            $dec = bcadd($dec, bcmul(strval(hexdec($hex[$i - 1])), bcpow('16', strval($len - $i))));
        }
        return $dec;
    }
}

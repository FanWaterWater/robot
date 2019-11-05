<?php

namespace App\Services;

class Sms
{

    /**
     * 发送短信验证码
     *
     * @param [type] $phone
     * @param [type] $code
     * @return void
     */
    public static function sendVerifyCode($phone, $code)
    {
        try {
            $config = [
                // HTTP 请求的超时时间（秒）
                'timeout' => 5.0,

                // 默认发送配置
                'default' => [
                    // 网关调用策略，默认：顺序调用
                    'strategy' => \Overtrue\EasySms\Strategies\OrderStrategy::class,

                    // 默认可用的发送网关
                    'gateways' => [
                        'submail',
                    ],
                ],
                // 可用的网关配置
                'gateways' => [
                    'errorlog' => [
                        'file' => '/tmp/easy-sms.log',
                    ],
                    'submail' => [
                        'app_id' => config('sms.submail.app_id'),
                        'app_key' => config('sms.submail.app_key'),
                        'project' => 'FtiDe', // 默认 project，可在发送时 data 中指定
                    ],
                ],
            ];

            $easySms = new \Overtrue\EasySms\EasySms($config);

            $data = [
                'data' => [
                    'code' => $code
                ]
            ];

            if (preg_match("/^1[3456789]{1}\d{9}$/", $phone)) {
                $easySms->send($phone, $data);
            } else {
                return false;
            }

            return true;
        } catch (\Overtrue\EasySms\Exceptions\NoGatewayAvailableException $e) {
            // dd($e->getResults());
            // \Log::info($e->getResults());
        }
    }

    /**
     * 淘宝预约任务的付款通知
     *
     * @param [type] $phone
     * @return void
     */
    public static function sendPayNotice($phone)
    {
        try {
            $config = [
                // HTTP 请求的超时时间（秒）
                'timeout' => 5.0,

                // 默认发送配置
                'default' => [
                    // 网关调用策略，默认：顺序调用
                    'strategy' => \Overtrue\EasySms\Strategies\OrderStrategy::class,

                    // 默认可用的发送网关
                    'gateways' => [
                        'submail',
                    ],
                ],
                // 可用的网关配置
                'gateways' => [
                    'errorlog' => [
                        'file' => '/tmp/easy-sms.log',
                    ],
                    'submail' => [
                        'app_id' => config('sms.submail.app_id'),
                        'app_key' => config('sms.submail.app_key'),
                        'project' => 'N2IPQ1', // 默认 project，可在发送时 data 中指定
                    ],
                ],
            ];

            $easySms = new \Overtrue\EasySms\EasySms($config);

            $data = [
                'data' => []
            ];

            if (preg_match("/^1[3456789]{1}\d{9}$/", $phone)) {
                \Log::info($phone);
                $easySms->send($phone, $data);
            } else {
                return false;
            }

            return true;
        } catch (\Overtrue\EasySms\Exceptions\NoGatewayAvailableException $e) {
            // dd($e->getResults());
            // \Log::info($e->getResults());
        }
    }

    /**
     * 绑定Tb买号通知
     *
     * @param [type] $phone
     * @return void
     */
    public static function sendUnBindTbAccountNotice($phone)
    {
        try {
            $config = [
                // HTTP 请求的超时时间（秒）
                'timeout' => 5.0,

                // 默认发送配置
                'default' => [
                    // 网关调用策略，默认：顺序调用
                    'strategy' => \Overtrue\EasySms\Strategies\OrderStrategy::class,

                    // 默认可用的发送网关
                    'gateways' => [
                        'submail',
                    ],
                ],
                // 可用的网关配置
                'gateways' => [
                    'errorlog' => [
                        'file' => '/tmp/easy-sms.log',
                    ],
                    'submail' => [
                        'app_id' => config('sms.submail.app_id'),
                        'app_key' => config('sms.submail.app_key'),
                        'project' => 'e5y6I2', // 默认 project，可在发送时 data 中指定
                    ],
                ],
            ];

            $easySms = new \Overtrue\EasySms\EasySms($config);

            $data = [
                'data' => []
            ];

            if (preg_match("/^1[3456789]{1}\d{9}$/", $phone)) {
                $easySms->send($phone, $data);
            } else {
                return false;
            }

            return true;
        } catch (\Overtrue\EasySms\Exceptions\NoGatewayAvailableException $e) {
            // dd($e->getResults());
            // \Log::info($e->getResults());
        }
    }

     /**
     * 绑定Jd买号通知
     *
     * @param [type] $phone
     * @return void
     */
    public static function sendUnBindJdAccountNotice($phone)
    {
        try {
            $config = [
                // HTTP 请求的超时时间（秒）
                'timeout' => 5.0,

                // 默认发送配置
                'default' => [
                    // 网关调用策略，默认：顺序调用
                    'strategy' => \Overtrue\EasySms\Strategies\OrderStrategy::class,

                    // 默认可用的发送网关
                    'gateways' => [
                        'submail',
                    ],
                ],
                // 可用的网关配置
                'gateways' => [
                    'errorlog' => [
                        'file' => '/tmp/easy-sms.log',
                    ],
                    'submail' => [
                        'app_id' => config('sms.submail.app_id'),
                        'app_key' => config('sms.submail.app_key'),
                        'project' => 'Lckqn', // 默认 project，可在发送时 data 中指定
                    ],
                ],
            ];

            $easySms = new \Overtrue\EasySms\EasySms($config);

            $data = [
                'data' => []
            ];

            if (preg_match("/^1[3456789]{1}\d{9}$/", $phone)) {
                $easySms->send($phone, $data);
            } else {
                return false;
            }

            return true;
        } catch (\Overtrue\EasySms\Exceptions\NoGatewayAvailableException $e) {
            // dd($e->getResults());
            // \Log::info($e->getResults());
        }
    }
}

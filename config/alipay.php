<?php
return [
    'pay1' => [
        // APPID
        'app_id' => '2019101368387245',
        // 支付宝 支付成功后 主动通知商户服务器地址  注意 是post请求
        'notify_url' => 'https://dawnll.com/api/alipay/notify',
        // 支付宝 支付成功后 回调页面 get
        'return_url' => 'https://dawnll.com/mobile/paySuccess.html',
        // 公钥（注意是支付宝的公钥，不是商家应用公钥）
        'ali_public_key' => '/usr/local/alipay/alipayCertPublicKey_RSA2_2019101368387245.pem',
        // 加密方式： **RSA2** 私钥 商家应用私钥
        'private_key' => 'MIIEpAIBAAKCAQEAt1LHJv3bfg9pNF1ybxXIIREhdBpZqpk6T0m2MHEV7Oi3r0UjFDaEdiCD6Fn8BMqZOrpUrNxUkLLLi3bldIXYMwT/wFH9eVLiIojJlql8pIvS0e6xUDqjqzYDu8OXzRg/R6SdRFTokOAEq94MdZveiU7x375Gt0Xm8sT5ok2aOmlsrB01UrUF0x7uFEf9hN8dZUDYHNL7MhlvGRLTCTHSwCWrGFglC3+qSOwcoYuo5Ta5yQPE1F7Rt5epUTpLeO/8dr/tpQif+p2qS13iVAvdPl2jdayVi/dZKNRZ8Hs4nsl7lSSJzc/SxtunImnx/3E7m3/b5SteC2Dnhh6AQcxKrwIDAQABAoIBAQCpTyMtKMFBoJwKR8+7NoO5vmeGIhv0CkYnGi3QeXDFd3zFu/WU4nDd5FPPEORHzJFOAu7XIzpa1TZVnL54KnEtVY2aol6WYW0GdgywP+Ik2hof1vId5bppEp7KF++n9J/k2+x/Qmfz/WFzFcWuDQGvEKEkgkgvVbjhN/hR5JfvHwQqsYwESF9v03uSdR7eahplT1eAH1aZQVGLkgo9vfTjZHpcdYTuKmjYqURNEH83svZfChEvzZen9rkQtb1VZcyTf6yDWSCQwBTF0qaaZSwKUFODdNOQ3zm28LZpSWYGZyfkMTVhetIkqxLckXGK0pZDZb79Gtfeyvfe1lhwmUShAoGBAOMqoKx/3ulD6QLmbcKLpIm1OpBVEhfE6wHIEAIBjHJK7BMj3ryPPHZv8IX9FxtzDxet8Ue4ZIq6gXBEe5RHL20EvFFI75J+YDYYfdm9uxXZPGFG2KWEuW1Og3tb4Mt4Nf40j6IyHEgb1wi9pWsi4QJ56rszPBB+7eN3BruFYn//AoGBAM6Xi2tbdOOKWwBbR14RXNDOfajJWlhMWRQMeTKBFllIffb61OuqS45HUmqXMCoNKnZkyEsmmVFh5mU1ViP+bj/zSLVW1WkODMhalZNIA/O8OPuNB83YuxMQXx4Bnq4Q7+lz4WoNVKiElWA+DKTShZ6RWPT7zui+bQp9F91W3jVRAoGAAbgg3y1YkothCBSWYBKOfDxS5SS/rk5fOPQ6qsk4NuU6RCrRVLwAySSvvVPdCOgmBRfb658Jo8Mll6PtC4I+aaTPiA31QjaSo9YrnapB8DhkrJfMq/QFMz6U4Coh2WhfgD0FmUSn0iPjzL0is1zgNxSVIjWRDs7nHgGYm3K2/CECgYBPK34vTyYVSOEk2tYXs3mpP2iidT9dFS0R5NHRS+zfnEtBidBs258G0EhCNtwrUU5Tfr3PJuScbnMXmAAB3TAs67OSYst37f1yDlzBy1hQYHJJ3DsAZK0UWjLJUf+YXz9BbLoWpTMrPVvtPPolc9Pm93Zqs9EQGmG5IkUx+mc/cQKBgQCHvWb1QABBC5luW1gow8NRubNTnmBZusb8OjBde9eFkRrrr99K+f4Ecm+m9k/og8IS//u9ivpg1ESmFu8L9jPV7A0GbC0zBOkpBXlHa8ZSKCjEXv37utfwC/wGgyqXGWSlUw2L1jdcz2U6xjiomeMSpx7oBzhSHsbPsKh5t7Azfg==',
        'app_cert_sn' => '2a85ca0162a84520a73b6da9383e6cbd',
        'alipay_root_cert_sn' => '687b59193f3f462dd5336e5abf83c5d8_02941eef3187dddf3d3b83462e1dfcf6',
        'log' => [ // optional
            'file' => '../storage/logs/alipay.log',
            'level' => 'info', // 建议生产环境等级调整为 info，开发环境为 debug
            'type' => 'single', // optional, 可选 daily.
            'max_file' => 30, // optional, 当 type 为 daily 时有效，默认 30 天
        ],
        'http' => [
            'timeout' => 5.0,
            'connect_timeout' => 5.0,
            // 更多配置项请参考 [Guzzle](https://guzzle-cn.readthedocs.io/zh_CN/latest/request-options.html)
        ],
        // 'mode' => 'dev', // optional,设置此参数，将进入沙箱模式(dev)
    ],
    'pay2' => [
        // APPID
        'app_id' => '2019041563831964',
        // 支付宝 支付成功后 主动通知商户服务器地址  注意 是post请求
        'notify_url' => 'https://dawnll.com/alipay/notify',
        // 支付宝 支付成功后 回调页面 get
        'return_url' => 'https://dawnll.com/pay-success',
        // 公钥（注意是支付宝的公钥，不是商家应用公钥）
        'ali_public_key' => 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA23NrboDJ8BVnSP3SQRkckZsZrOkzL8Eesr9mxd7R6QD8ms5xcDezyO/BAIkdoo68axeIU8A9YHnuLslp9/XHE1+cmqVXMSdKNilrJC9+wivzUU4CwvOX30/d/ERtXMeZkWcDIf47UNDW6ySHSN0emqynWVyxkE9DE9zycKbs9Z2jICIPa0xhXoX4u9apTKLJ6AmoQiytiNHrnzwGVnvM+Hmq13C73rUYpn16xg2KZWwxWChPW747izwVCFSWNXywGKqpBNwfV7ClskLdTDQtiETeQmXiEjqY1jKqFGshnwHvOKZzICHbrtnNcCUKtLjIALqfSIMlOXKyIZyRv4LJtwIDAQAB',
        // 加密方式： **RSA2** 私钥 商家应用私钥
        'private_key' => 'MIIEpAIBAAKCAQEAybgn2dG4pvpCURVlRuAHMGLb6MhVJkuGlOntFRc67t2hSoSBLLjNxzIHdiDgkd2VEd2ePffVNuhfwsvO4+fHlYb7mgMO7WNza9LL3OIeyYcK5RooqwdsW1eTs35iW8uyCiV1rf4vLf/pTXpC4+NZHzXlHQ3DTUWI7BOpVgPiwlNg9WmDH12WSt/xnWh6wfh3PxaHWTRjwGYWw3qbo5s2H6yj2Orm8AWgVap8CsDk6L80LmHN6D0JENqaK/djSKVB+iDYzyJvQEgiMAtwv9G516/JtOP+ZIWncxxP3StBTyrsy7heCfC9oa+XfvoRloHzrYxqJ1ymLGJOLSek4hDfjwIDAQABAoIBAQC4cvHNlJ054eA98Eh5NGSec+cNxhFGQQ1AoV4uSN2UiYfwcZUEZb+UA0UbWRi/iFPE0Fbf5vxJhtX5cw8tCkVPjuwFegJuQt/JmijbQtBQCnGF6BODv/fu1feyyz/5HBsid/pRLPnLIBQeykrbwok9prRniqwovgpjg971TfxNHvp3D7N+7vmpNz5AUNE49hYZ0D7isUWzP/X/QNw7IDYO8N9huxuREXQ+VuzsMVCE43UZAdTA1vgNFce8fkj7Vs3r6qMqoP70hjY9cVYYEMvZ5qL7AUDpCwPEjzxI+mcgijQCcQj7G6HA1RqXR65Lx/AxpI6+Ss6tJnIOCnRjfpexAoGBAP49wfXDPo2cDSBCXSiz9T4UILR/VXb3/6jPX1+6Tx0y8TnQGgPme953bZRaNoLGkIJrTWnXT0shLFBUp37zR77ahLczUP5Wtwh5KTlUHw9qTfLCN1pdZ9z7P+cl6HSYgs4pS5+xjSQW/5cHY2CJO0/Awrgir7oAAmb3m+NrhVTFAoGBAMsdYrqbAInOPEbuAuXzONKxbBW8rPv9GaPyE+w0op23mjG6TeL+aN3IJaJ6v1FwHHQKA/QYiK5lDHbKCOlknfQHE/rmRvsaXUmCoZNWlQtjgN4BuBkyehHc1AG+hTGR4wKdyh85PnkU47Y4IdSSLvLC02HqdM1hpA+encOtF/BDAoGAA6WHHqtKPmW6mnfZNjg+kEFhprUc2LP96sHusETP1a9hXl7pwJyRskMsQzB4D7Ahan13gskfzggPxqcwL9X1dXtU4/vMcZl0zp5ORRA70dDIhW7btGQalUTVSc91Yha96Y8WEphNWfMqf1QPzNarDx3IrTNyKczOPAPZLI3iP7ECgYEAwdeEjpQ4+ksxaXviljP96c3bWg9bg41z9+uiqc092IkNhiHIDTdBO0+04xCEH6N/9BpO1ZjIcK8NKxz7TkpxGB/dKJi16xSpLOuXafa6fUj0Bmvbl2h96Sg3yIZbtQgGf0u5Rv0pqwKNoyyE1MrCNXpLo+nOmOdzXFjDNaiu7OMCgYB8Uyfe+7DbIx++nUfO1BSMR1ahS5kCy55BZmzsL5rTVmPvoYFp4sH76mQ4/sj2xxVDOOODUEw6p4KcR9Gqg/OcSLmAwqP4IyB0sNS4Iv4oXErn/axWmtMk2Ebw1yXhWgyu461eh+rGx8dCIkm26nQkCXsx7XdqMXh/9OBDf3gNaw==',
        'log' => [ // optional
            'file' => '../storage/logs/alipay.log',
            'level' => 'info', // 建议生产环境等级调整为 info，开发环境为 debug
            'type' => 'single', // optional, 可选 daily.
            'max_file' => 30, // optional, 当 type 为 daily 时有效，默认 30 天
        ],
        'http' => [
            'timeout' => 5.0,
            'connect_timeout' => 5.0,
            // 更多配置项请参考 [Guzzle](https://guzzle-cn.readthedocs.io/zh_CN/latest/request-options.html)
        ],
        // 'mode' => 'dev', // optional,设置此参数，将进入沙箱模式(dev)
    ]
];

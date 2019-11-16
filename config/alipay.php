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
        'app_id' => '2019040963868167',
        // 支付宝 支付成功后 主动通知商户服务器地址  注意 是post请求
        'notify_url' => 'https://dawnll.com/alipay/notify',
        // 支付宝 支付成功后 回调页面 get
        'return_url' => 'https://dawnll.com/mobile/paySuccess.html',
        // 公钥（注意是支付宝的公钥，不是商家应用公钥）
        'ali_public_key' => '/usr/local/alipay/alipayCertPublicKey_RSA2_2019040963868167.pem',
        // 加密方式： **RSA2** 私钥 商家应用私钥
        'private_key' => 'MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQD68tq8RUG+Jjvloe9MMkXOTDCH1WSHAezuYsMPBruqxvZGIbum3jvt0AU1vYBQyjy28Mq7625+IEH2wd4Bo9rmDIP1q70aSvDRFWqO1zdQ9cWaY9dJBdpjgCuVNrmmMjXMNO6kshlDql+3Iny0W2dSZRtV40O5mk+c0vTtgByT72ZRbF42ZhH+vAjUYMMU/cXeO+7+llvnKMe6O0DoueTtpC4GMwMjQHMX05VWoWUDZ6JW0Z3QdkVmWB37VWH1iFGVAf+NIst29/Ur/BKaXJ8t/e8AqkWd6f+hj+37KL4WnX4OikftzxPixlfPukGCmI6P2G1Oy7ZXddNafsQbzucTAgMBAAECggEAG6tPRtb0Cr04eXdDZUldvQNVjoSO0vv5Xcdx7mQ1qPzLBqyNfjaesPfwux4r2bySuTEPiWzKAAoae9SgX9nrNtZGbn4DGbUNnGAaIanFJZ4TrZQ4loqYq8PkCk3AZny+xcdIUMx6UKWmbBDXYyN43vLa8rteKkbDZG02KEGp5P2WiykkVMEXeT2pmhC9FZiYzsS40q2D7HPFlPkuEMh4L+JV8YmELjwsuTaq9kQiDcM8JH3dlnqr+MsxsYDozspMsrUjDYE8cOkYBinIRP1+NDx6rAU6JYEj6qpZqk62FV3sxZrShBGOPcOR/5hN4tP/J2rjcWcbNFSbOLWL0iamYQKBgQD/2mzm3sc/tJEpB6fJ81lpQV3dGWngcpaKhH8RYC3031Zk553+Fjw+7uVj2/jM/ZD5V0jRY+KJMV34RzuB9KlYh1U3o40K4aC30nYQfJrViHk9qoRm8hsi7nxgzASiHCNfpTUSVHUAsuqNrZ60LyxEOWKGqf45YZoCnZ61dbs0GQKBgQD7F7VwwaPqOh0rV02oWDY9CKeq5JhNeLEPVxS3yhGbcTMCKZV0cbBrPG/sSpR1qWXKhbvh4YzGf/i2gcXCQT06fOxq21U0f1I/Jbwye6YKfRtMfea7W/q99ImDhkeYCw6OPNmiMEVfzjoJFQ8922X8ImFkr1c1juml5QXgCWY6CwKBgDehnNBOXHCjqHSNb5Rfz28tgWVT40ukXstbp+11RkjaTwS9wALBfvQIKeSereiUsfMlYXX2DAncrBwSEQRe2HuhYYwpib918+ZEYtuO3HPVqtcXvpZLyk68IFtDwTYmfCKN345OwuoV/R41RC7VmwByodO6HscHS9+JujqmkL/xAoGAeYtkfQx/OCahcBV2tgLdXnYOE59MSlQeAXr5wG3EUCZftrBCdHeEGqTK2OrRKpOxfnN2G0V/S6cu0cnH3NyPsvw9xQwfFqZ7Pa4ah6VrHrCowkI/qno/yivRVSVvCp5vkVLLVsNfEZ1WYocbNao6l+5cjsyBvp9LYs6WJXjnTzkCgYAsOwl6+fN7XiVyabS6W5/KEe4L79RmmX0Zg8opIzil+QCfW8P8v35kVmJVHFeL2/2IDOah+XHjXKkH54fK6B3V9uDECwg6+ej7gJ2Ypv4NfddFGTCmwwF0f/896dDkr0bnBcSBE5uG6BMwF9dSaZbfVqhdVM/uCe95yJwrrQqFlg==',
        'app_cert_sn' => '61c1902c184c2b72b0395d93e07d47a9',
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
    ]
];

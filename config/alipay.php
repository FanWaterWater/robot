<?php
return [
    'pay1' => [
        // APPID
        'app_id' => '2019041563854921',
        // 支付宝 支付成功后 主动通知商户服务器地址  注意 是post请求
        'notify_url' => 'https://smfet.com/alipay/notify',
        // 支付宝 支付成功后 回调页面 get
        'return_url' => 'https://smfet.com/pay-success',
        // 公钥（注意是支付宝的公钥，不是商家应用公钥）
        'ali_public_key' => 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAg2OV8CCPmx6vtwSFbdB73L515YoklMw/tvT5Qmdeiwh4o1eI5lVgl6AmGO4pJAvy9mTI4MUZmDcrxF3rey7TO2IhnU4fXyVNsfIIwD5RTfWLejeYGnWo1DiRlplLU6gFC+fDgKsT6HkEGndE4FOvLGWfRcp8wMiFBa0fuNeEfw5AhARwDlrfuZzoMCHhnNbowzo6O4/SM1ngyswUozpyz5bzh69shrhNsIgAGu+sND0IP/IC/+SCYmdpd/1LF/6ODHD9lrT/g8Eol3+go8TlZ0EG1UEhYsxHJjubARkqTGe4GuBqedTEidhVwKWZT3EeexrSs7w+xWkZkrv/bYeWGQIDAQAB',
        // 加密方式： **RSA2** 私钥 商家应用私钥
        'private_key' => 'MIIEogIBAAKCAQEA3Cj98+uUP8SMbq9uwGJG7fJlBuKbQiVwRaScKHdvqFlM0InwfOmgpE6syixDRUxZeJioWnbwiyhAaEZwzhuLuSkBK0CeZLi3ZRDaNMi0PWqVWDkl8XBkK24Od1LOoto7gd/TBYwC8LKqXdilOYpnqTHLwhoE/xR2Nj89nhDHOu4LzssOfR84zHSjfjSQ28mVyO4X3OmEzwKt0C/Wc6dhbJtbFbWc74zA/SCBN4QMZL+wM7C3Ad2cChjr82HIzcwNIKb6eQNfBqGLtHp5RVidzO74AK7amC9V3M+2QkE813OmIObEQ8Zmi0AfIPfHkV9LMMoo/VL891WGgt4A+h3jCQIDAQABAoIBAFR70oAQzdHunak33vsqe2eCFeyfds7aSQwgj+AjfRCQPB7mYAe/K2sB2eK3O5VTKB5UDn6wl7v+1UBuj4k4HtUN/CnZ4S5rh8zbu7B3uFq9FNRHEd1lsLrNv/VgLHVn42ACQRsm0FYHacMbiMPc7cyKlFNG4tXzxy0n9YA7lghxbIAoQjaOuZJ8qvmUyFU6DNzghYwLNVY4cmQiy6SQtRjsKWR8mZvias2p3iO0W+cecT+bQD76pdzj4IIMTEwI3gErLdG8nCBQ2d8PW4Nq1fZ57lSXCRiE7TnENi9xqnFRisRgj46MhizPEXsVweUqaON/JRE7Z2CrJPO7ZI3dYcUCgYEA9SIOkB7vPjzAwDie4U9wl7/N+xzJ+k9AAJHYJVyuhDcmox7o4nk8xxYYstow7TKZChvgqMHU/36/WpfiMedq0F2+K5QJ16rn3fybz/naYacRvqcN9OWWL7W7PaKLeorAVidtFJ6XJOENgb1KUX+slxA7kS6f7f/r8Z4F1B2dIBcCgYEA5euGXcknB6EjLxMjbw1JClfb0JpztcRcdbgyihlmw3qu1Ea/jiq9pCvbNmQ4oQngxi2CjT7Aix8843mPV/KSsCoA+VpwmQfGztpVrBYZVWO0ZY27lzWYh9tkZlhlJmc/j/Ztqj0pQ4D/3i3jN+zTTrYhur/NYt0fw9UDFqCG6d8CgYAHi1nJY7pXPwVrpRJ2urwrX3LWdKdetcuxeMufMsAIP65HvO7L8ZFGS07NSlvRIQqGvh7m8rg8eMko353NjWLDMO9mZfL7mT3zng+pkfX/pWWtaXTLgblilIRDvFnwlo6e2C3KQatDLk39HTdJVNWZ/JzotfekGolHcWaahaLNVwKBgGhCEt34VwB4q1GvZgP3jEVqbbz8LLgh4KNo8VH6DsVZnmmX40j+TJxjXrYdYCh2KDz1ahvOdtUfRycHel6xGp9TjLmFr0VVZ2tpSiwMoVQ9MBJU4NnCbfY9IBvgvY1aiFIptrTZoxp/JoeDW2OCupcYs9bRHrtT9hGBSDM8e7EVAoGAYRVrZYfRVYpe4eyHj8BnuVZdArpXoa1Qc1dG911VxO+kS36VryqYhcrltzB4t2wO2ZV/eEreKExkmC7UvPB26rzcUpN+nOXW48y6OJDMsrDeDkCG4yshSVMafN8CEjHKf14mPNcBBDx5+J92Ygbetkr7qWIX+803/i2sVy0f/v8=',
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
        'notify_url' => 'https://smfet.com/alipay/notify',
        // 支付宝 支付成功后 回调页面 get
        'return_url' => 'https://smfet.com/pay-success',
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

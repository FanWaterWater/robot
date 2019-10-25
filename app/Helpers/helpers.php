<?php

use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Models\CreditConfig;
use Illuminate\Support\Facades\DB;
use App\Models\CreditLevel;
use App\Models\Master;
use App\Models\Apprentice;
use App\Models\Level;
use App\Utils\CreditAction;
use App\Models\MasterRecord;
use App\Utils\UserType;

//对返回给前端前对数据进行格式处理

function success($data = [], $message = '操作成功', $code = 200)
{
    $res = [
        'msg'  => $message,
        'status' => 'success',
        'code' => $code,
        'data' => $data
    ];
    if (isset($data['count'])) {
        $res['count'] = $data['count'];
        unset($res['data']['count']);
    }
    //分页特殊处理
    if ($data instanceof LengthAwarePaginator) {
        $data = $data->toArray();
        $res['data']  = $data['data'];
        $res['count'] = $data['total'];
    }
    return response()->json($res)->setStatusCode($code);
}


//对返回给前端前对数据进行格式处理
function error($message = '操作失败', $code = 200, $error_code = null)
{
    if ($error_code) {
        $res = [
            'msg' => $message,
            'status' => 'error',
            'code' => $error_code
        ];
    } else {
        $res = [
            'msg' => $message,
            'status' => 'error'
        ];
    }
    throw new HttpResponseException(response()->json($res)->setStatusCode($code));
}

function errorMsg($message = '操作失败')
{
    throw new Exception($message);
}

function getOrderNo()
{
    return strtoupper(str_random(6)) . date('YdmHis', time());
}

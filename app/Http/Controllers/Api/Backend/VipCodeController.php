<?php

namespace App\Http\Controllers\Api\Backend;

use App\Models\Level;
use App\Models\VipCode;
use Illuminate\Http\Request;
use App\Services\LaravelExcel;
use App\Http\Controllers\Controller;
use App\Http\Requests\Web\VipCodeRequest;

class VipCodeController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->limit;
        $status = $request->status ?? -1;
        $code = $request->code;
        $startDate = $request->startDate;
        $endDate = $request->endDate ? $request->endDate . ' 23:59:59' : null;;
        $orderBy = $request->orderBy ? 'asc' : 'desc';
        $codes = VipCode::when($code, function ($query) use ($code) {
            return $query->where('code', 'like', '%' . $code . '%');
        })->when($status > -1, function ($query) use ($status) {
            return $query->where('status', $status);
        })->when($startDate, function ($query) use ($startDate) {
            return $query->where('created_at', '>=', $startDate);
        })->when($endDate, function ($query) use ($endDate) {
            return $query->where('created_at', '<=', $endDate);
        })->with(['user', 'level'])->orderBy('created_at', $orderBy)->paginate($limit);
        return success($codes);
    }

    public function store(Request $request)
    {
        $level_id = $request->level_id;
        $count = $request->count;
        $vipCode = [];
        for ($i = 0; $i < $count; $i++) {
            $code = VipCode::generateCode();
            $vipCode[] = VipCode::create(['code' => $code, 'level_id' => $level_id]);
        }
        if (isset($vipCode)) {
            return success($vipCode);
        }
        return error();
    }

    public function show($id)
    {
        $vipCode = VipCode::with(['user', 'level'])->find($id);
        return success($vipCode);
    }

    public function update(Request $request, $id)
    {
        $data = request()->all();
        if (VipCode::where('id', $id)->update($data)) {
            return success();
        }
        return error();
    }

    public function destroy($id)
    {
        if (VipCode::where('id', $id)->delete()) {
            return success();
        }
        return error();
    }

    public function export(Request $request)
    {
        $status = $request->status ?? -1;
        $code = $request->code;
        $startDate = $request->startDate;
        $endDate = $request->endDate ? $request->endDate . ' 23:59:59' : null;;
        $orderBy = $request->orderBy ? 'asc' : 'desc';
        $codes = VipCode::when($code, function ($query) use ($code) {
            return $query->where('code', 'like', '%' . $code . '%');
        })->when($status > -1, function ($query) use ($status) {
            return $query->where('status', $status);
        })->when($startDate, function ($query) use ($startDate) {
            return $query->where('created_at', '>=', $startDate);
        })->when($endDate, function ($query) use ($endDate) {
            return $query->where('created_at', '<=', $endDate);
        })->with(['level'])->orderBy('created_at', $orderBy)->get();
        $data = [];
        $title = ['ID', '会员ID', '会员等级', '激活码', '使用状态', '创建时间'];
        array_push($data, $title);
        foreach ($codes as &$code) {
            $code->level = Level::find($code->level_id)['name'];
            if ($code->status == 1) {
                $code->status = '已使用';
            } else {
                $code->status = '未使用';
            }
            array_push($data, [$code->id, $code->user_id, $code->level, $code->code, $code->status, $code->created_at]);
        }
        $name = 'VIP激活码';
        LaravelExcel::export($name, $data);
    }
}

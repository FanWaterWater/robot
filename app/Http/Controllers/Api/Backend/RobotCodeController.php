<?php

namespace App\Http\Controllers\Api\Backend;

use App\Models\Level;
use App\Models\RobotCode;
use Illuminate\Http\Request;
use App\Services\LaravelExcel;
use App\Http\Controllers\Controller;

class RobotCodeController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->limit;
        $status = $request->status ?? -1;
        $code = $request->code;
        $startDate = $request->startDate;
        $endDate = $request->endDate ? $request->endDate . ' 23:59:59' : null;
        $orderBy = $request->orderBy ? 'asc' : 'desc';
        $codes = RobotCode::when($code, function ($query) use ($code) {
            return $query->where('code', 'like', '%' . $code . '%');
        })->when($status > -1, function ($query) use ($status) {
            return $query->where('status', $status);
        })->when($startDate, function ($query) use ($startDate) {
            return $query->where('created_at', '>=', $startDate);
        })->when($endDate, function ($query) use ($endDate) {
            return $query->where('created_at', '<=', $endDate);
        })->orderBy('id', $orderBy)->paginate($limit);
        return success($codes);
    }

    public function store(Request $request)
    {
        $count = $request->count;
        $robotCode = [];
        for ($i = 0; $i < $count; $i++) {
            $code = RobotCode::generateCode();
            $robotCode[] = RobotCode::create(['code' => $code]);
        }
        if (isset($robotCode)) {
            return success($robotCode);
        }
        return error();
    }

    public function show($id)
    {
        $robotCode = RobotCode::with(['user', 'level'])->find($id);
        return success($robotCode);
    }

    public function update(Request $request, $id)
    {
        $data = request()->all();
        if (RobotCode::where('id', $id)->update($data)) {
            return success();
        }
        return error();
    }

    public function destroy($id)
    {
        if (RobotCode::where('id', $id)->delete()) {
            return success();
        }
        return error();
    }

    public function export(Request $request)
    {
        $status = $request->status ?? -1;
        $code = $request->code;
        $startDate = $request->startDate;
        $endDate = $request->endDate;
        $orderBy = $request->orderBy ? 'asc' : 'desc';
        $codes = RobotCode::when($code, function ($query) use ($code) {
            return $query->where('code', 'like', '%' . $code . '%');
        })->when($status > -1, function ($query) use ($status) {
            return $query->where('status', $status);
        })->when($startDate, function ($query) use ($startDate) {
            return $query->where('created_at', '>=', $startDate);
        })->when($endDate, function ($query) use ($endDate) {
            return $query->where('created_at', '<=', $endDate);
        })->orderBy('id', $orderBy)->get();
        $data = [];
        $title = ['ID', '会员ID', '激活码', '使用状态', '创建时间'];
        array_push($data, $title);
        foreach ($codes as &$code) {
            if ($code->status == 1) {
                $code->status = '已使用';
            } else {
                $code->status = '未使用';
            }
            array_push($data, [$code->id, $code->user_id, $code->code, $code->status, $code->created_at]);
        }
        $name = '激活码';
        LaravelExcel::export($name, $data);
    }
}

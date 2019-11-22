<?php

namespace App\Http\Controllers\Api\Backend;

use App\Models\User;
use App\Utils\FundType;
use App\Models\UserFund;
use App\Models\Withdraw;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class WithdrawController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->limit ?? 10;
        $status = $request->status ?? -1;
        $verify_status = $request->verify_status ?? -2;
        $order_no = $request->order_no;
        $startDate = $request->startDate;
        $endDate = $request->endDate ? $request->endDate . ' 23:59:59' : null;;
        $orderBy = $request->orderBy ? 'asc' : 'desc';
        $withdraws = Withdraw::when($order_no, function ($query) use ($order_no) {
            return $query->where('order_no', 'like', '%' . $order_no . '%');
        })->when($status > -1, function ($query) use ($status) {
            return $query->where('status', $status);
        })->when($verify_status > -2, function ($query) use ($verify_status) {
            return $query->where('verify_status', $verify_status);
        })->when($startDate, function ($query) use ($startDate) {
            return $query->where('created_at', '>=', $startDate);
        })->when($endDate, function ($query) use ($endDate) {
            return $query->where('created_at', '<=', $endDate);
        })->with(['user:id,username,nickname'])->orderBy('id', $orderBy)->paginate($limit);
        return success($withdraws);
    }

    public function show($id)
    {
        $withdraw = Withdraw::with(['user'])->find($id);
        return success($withdraw);
    }

    public function update(Request $request, $id)
    {
        $data = $request->all();
        if (Withdraw::where('id', $id)->update($data)) {
            return success();
        }
        return error();
    }

    public function destroy($id)
    {
        if (Withdraw::where('id', $id)->delete()) {
            return success();
        }
        return error();
    }

    public function verify(Request $request, $id)
    {
        $verify_status = $request->verify_status;
        $remark = $request->remark ?? null;
        $data = ['verify_status' => $verify_status, 'remark' => $remark];
        DB::beginTransaction();  //开启事务
        try {
            $withdraw = Withdraw::find($id);
            if ($verify_status == -1) {
                $user = User::find($withdraw->user_id);
                $priceTotal = $withdraw->price + $withdraw->handle_fee;
                $user->increment('amount', $priceTotal);
                UserFund::create([
                    'user_id' => $user->id,
                    'type' => FundType::WITHDRAW,
                    'change_amount' => $priceTotal,
                    'after_amount' => $user->amount,
                    'content' =>  '提现驳回，返款' . $priceTotal . '元;驳回原因:' . $remark,
                    'remark' => '提现驳回'
                ]);
            } else {
                UserFund::create([
                    'user_id' => $user->id,
                    'type' => FundType::WITHDRAW,
                    'change_amount' => 0,
                    'after_amount' => $user->amount,
                    'content' => '提现成功，提现' . $withdraw->price . '元,手续费' . $withdraw->handle_fee . '元',
                    'remark' => '提现成功'
                ]);
            }
            Withdraw::where('id', $id)->update($data);
            DB::commit();
            return success();
        } catch (Exception $e) {
            DB::rollback();
            return error($e);
        }
    }
}

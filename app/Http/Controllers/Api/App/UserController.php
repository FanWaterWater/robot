<?php

namespace App\Http\Controllers\Api\App;

use App\Models\User;
use App\Models\Level;
use App\Services\Token;
use App\Utils\FundType;
use App\Models\UserFund;
use App\Models\Withdraw;
use App\Models\BankAccount;
use Illuminate\Http\Request;
use App\Models\AlipayAccount;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use App\Http\Requests\App\UserRequest;

class UserController extends Controller
{
    public function login(Request $request)
    {
        $credentials = request(['username', 'password']);
        $token = User::login($credentials);
        if (!$token) {
            return error('账号或密码错误');
        }
        return $this->respondWithToken($token);
    }

    /**
     * 注册
     *
     * @return \Illuminate\Http\Response
     */
    public function register(UserRequest $request)
    {
        DB::beginTransaction();
        try {
            // dd($request->verify_code);
            $data = [];
            // if (Cache::get('verify_code' . $request->username) != $request->verify_code) {
            //     return errorMsg('验证码错误！');
            // }
            $user = User::where('id', $request->invite_code)->first();
            if (isset($user)) {
                $data['invite_id'] = $user->id;
            } else {
                return errorMsg('邀请码不正确！');
            }
            //TODO: 必须是手机号码,验证手机号码格式
            $data['nickname'] = $request->nickname;
            $data['username'] = $request->username;
            $data['password'] = bcrypt($request->password);
            // $data['invite_code'] = str_random(8);
            $data['nickname'] = $request->nickname;
            $data['add_type'] = 1;
            $data['level_id'] = Level::getLevels()[0]['id'];
            $newUser = User::create($data);
            if ($newUser) {
                DB::commit();
                return success();
            }
        } catch (\Exception $e) {
            DB::rollback();
            return error($e->getMessage());
        }
    }

    public function forgetPassword(Request $request)
    {
        DB::beginTransaction();
        try {
            // dd($request->verify_code);
            if (Cache::get('verify_code' . $request->username) != $request->verify_code) {
                return errorMsg('验证码错误！');
            }
            $user = User::where('username', $request->username)->first();
            if (!isset($user)) {
                return errorMsg('用户不存在！');
            }
            $user->password = bcrypt($request->password);
            if ($user->save()) {
                DB::commit();
                return success();
            }
        } catch (\Exception $e) {
            DB::rollback();
            return error($e->getMessage());
        }
    }

    public function user(Request $request)
    {
        $user = User::find($request->user_id, ['id', 'nickname', 'username', 'avatar']);
        return success($user);
    }

    public function logout()
    {
        if (\Auth::guard('user')->check()) {
            \Auth::guard('user')->logout();
        }
        return success([], '登出成功');
    }

    protected function respondWithToken($token)
    {
        $user = User::with('level:id,name', 'alipay', 'bank')->find(\Auth::guard('user')->id());
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60,
            'user' => $user,
            'status' => 'success'
        ]);
    }

    /**
     * 获取用户信息
     *
     * @return void
     */
    public function info()
    {
        $user = User::with('level:id,name', 'alipay', 'bank')->find(Token::id());
        Level::isUpgrade(Token::id());
        return success($user);
    }

    /**
     * 用户提现
     *
     * @return void
     */
    public function withdraw(Request $request)
    {
        $price = $request->price;
        $type = $request->type;
        if ($price < 10 || $price % 10 != 0) {
            return error('提现金额必须是10的倍数');
        }
        //计算手续费
        $fee = 2;
        if (($price * 0.05) > 2) {
            $fee = $price * 0.05;
        }
        $priceTotal = $price + $fee;
        DB::beginTransaction();
        try {
            $withdrawCount =  Withdraw::lockForUpdate()->where('user_id', Token::id())->whereDate('created_at', date('Y-m-d'))->count();
            if ($withdrawCount > 0) {
                return errorMsg('一天只限提现1次，请明天再来');
            }
            $user = User::lockForUpdate()->find(Token::id(), ['id', 'amount', 'alipay_account_id', 'bank_account_id']);
            if (!isset($user)) {
                return errorMsg('用户不存在');
            }
            if ($priceTotal > $user->amount) {
                return errorMsg('余额不足');
            }
            $user->decrement('amount', $priceTotal);
            $accountId = $type == 0 ? $user->alipay_account_id : $user->bank_account_id;
            Withdraw::create([
                'price' => $price,
                'handle_fee' => $fee,
                'user_id' => $user->id,
                'type' => $type,
                'account_id' => $accountId
            ]);
            UserFund::create([
                'user_id' => $user->id,
                'type' => FundType::WITHDRAW,
                'change_amount' => -$priceTotal,
                'after_amount' => $user->amount,
                'content' => '用户提现' . $price . '元，手续费' . $fee . '元',
                'remark' => '提现发起'
            ]);
            DB::commit();
            return success();
        } catch (\Exception $e) {
            DB::rollback();
            return error($e->getMessage());
        }
    }

    /**
     * 用户资金记录
     */
    public function fund(Request $request)
    {
        $type = $request->type;
        $funds = UserFund::when($type > -1, function ($query) use ($type) {
            return $query->where('type', $type);
        })->where('user_id', Token::id())->orderBy('id', 'desc')->paginate(config('common.pagesize'));
        return success($funds);
    }

    /**
     * 修改密码
     *
     * @param Request $request
     * @return void
     */
    public function editPassword(Request $request)
    {
        $user = User::find(Token::id());
        if (!isset($user)) {
            return error('用户不存在');
        }
        $credentials = [
            'username' => $user->username,
            'password' => $request->old_password
        ];
        $token = User::login($credentials);
        if (!$token) {
            return error('原密码错误');
        }
        if ($request->old_password == $request->new_password) {
            return error('新密码不能跟原密码相同');
        }
        $user->password = bcrypt($request->new_password);
        if ($user->save()) {
            return success();
        }
        return error();
    }

    /**
     * 编辑个人信息
     */
    public function editInfo(Request $request)
    {
        $user = User::with('level:id,name', 'alipay', 'bank')->find(Token::id());
        if (!isset($user)) {
            return error('用户不存在');
        }
        $user->nickname = $request->nickname;
        $user->wechat = $request->wechat;
        $user->phone = $request->phone;
        $user->avatar = $request->avatar;
        if ($user->save()) {
            return success($user);
        }
        return error();
    }

    public function bindAlipay(Request $request)
    {
        $user = User::find(Token::id());
        if (!isset($user)) {
            return error('用户不存在');
        }
        if ($user->alipay_account_id == 0) {
            $account = AlipayAccount::create([
                'user_id' => $user->id,
                'name' => $request->name,
                'account' => $request->account,
            ]);
            $user->alipay_account_id = $account->id;
        } else {
            AlipayAccount::find($user->alipay_account_id)->update([
                'name' => $request->name,
                'account' => $request->account,
            ]);
        }
        if ($user->save()) {
            $user = User::with('level:id,name', 'alipay', 'bank')->find(Token::id());
            return success($user);
        }
        return error();
    }

    public function bindBank(Request $request)
    {
        $user = User::find(Token::id());
        if (!isset($user)) {
            return error('用户不存在');
        }
        if ($user->bank_account_id == 0) {
            $account = BankAccount::create([
                'user_id' => $user->id,
                'bank' => $request->bank,
                'name' => $request->name,
                'account' => $request->account,
            ]);
            $user->bank_account_id = $account->id;
        } else {
            BankAccount::find($user->bank_account_id)->update([
                'bank' => $request->bank,
                'name' => $request->name,
                'account' => $request->account,
            ]);
        }
        if ($user->save()) {
            $user = User::with('level:id,name', 'alipay', 'bank')->find(Token::id());
            return success($user);
        }
        return error();
    }
}

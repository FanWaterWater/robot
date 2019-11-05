<?php

namespace App\Models;

use App\Utils\FundType;
use App\Utils\TeamRole;
use App\Utils\AccountType;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements JWTSubject
{
    protected $table = 'users';
    protected $guarded = [];
    protected $hidden = ['password'];

    public static function boot()
    {
        parent::boot();

        static::created(function ($model) {
            $model->joinTeam();
        });

        static::deleted(function ($model) {
            $model->quitTeam();
        });

        static::updated(function ($model) {
            Cache::forget('user_' . $model->id);
        });
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * 额外在 JWT 载荷中增加的自定义内容
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return ['role' => 'user'];
    }

    public static function login($credentials)
    {
        if ($token = \Auth::guard('user')->attempt($credentials)) {
            return $token;
        }
        return false;
    }

    /**
     * 获取上级
     *
     * @param integer $pid
     * @param integer $level
     * @return void
     */
    public function superiors($pid = 0)
    {
        global $superiors;
        if ($pid == 0) {
            $superiors = null;
        }
        $user = $this->find($this->invite_id, ['id', 'invite_id']);
        if (isset($user)) {
            $superiors[$pid] = $user;
            $user->superiors($pid + 1);
            unset($user);
        }

        return $superiors;
    }

    /**
     * 直推
     *
     * @return void
     */
    public function directUsers()
    {
        return $this->hasMany(User::class, 'invite_id', 'id')->with('level');
    }

    /**
     * 获取用户表与会员表的关联，一对一
     *
     * @return void
     */
    public function level()
    {
        return $this->hasOne(Level::class, 'id', 'level_id');
    }

    /**
     * 推荐人
     *
     * @return void
     */
    public function recommend()
    {
        return $this->hasOne(User::class, 'id', 'invite_id');
    }

    /**
     * 获取机器关联
     *
     * @return void
     */
    public function robots()
    {
        return $this->hasMany(Robot::class, 'id', 'user_id');
    }

    /**
     * 支付宝信息
     *
     * @return void
     */
    public function alipay()
    {
        return $this->hasOne(Account::class)->where('type', AccountType::ALIPAY);
    }

    /**
     * 银行卡信息
     *
     * @return void
     */
    public function bank()
    {
        return $this->hasOne(Account::class)->where('type', AccountType::BANK);
    }

    /**
     * 直推间推购买机器的奖励
     *
     * @param [type] $type
     * @return void
     */
    public function incomeReward($type)
    {
        $user = User::with('level')->find($this->id);
        if ($type == TeamRole::DIRECT) {
            $reward = $user->level->direct_reward;
            $type = '直推';
        } else if ($type == TeamRole::INDIRECT) {
            $reward = $user->level->indirect_reward;
            $type = '间推';
        }
        $user->increment('amount', $reward);    //增加可用收益
        $user->increment('amount_total', $reward);  //增加总收益
        UserFund::create([
            'user_id' => $user->id,
            'type' => FundType::INVITE_INCOME,
            'change_amount' => $reward,
            'after_amount' => $user->amount,
            'content' => $type . '用户购买机器，奖励' . $reward . '元',
            'remark' => '邀请用户购买机器奖励'
        ]);
    }

    /**
     * 更新今日机器数量
     *
     * @return void
     */
    public function updateTodayRobotCount()
    {
        $myRobots = Redis::smembers('robot' . $this->id);
        $directRobots = Redis::smembers('direct_robot' . $this->id);
        $indirectRobots = Redis::smembers('indirect_robot' . $this->id);
        $teamRobots = Redis::smembers('team_robot' . $this->id);
        // $teamRobotTotals = Redis::smembers('team_robot_total' . $this->id);
        if(count($myRobots)) {
            Redis::sadd('today_robot'. $this->id, $myRobots);
        }
        if(count($directRobots)) {
            Redis::sadd('today_direct_robot'. $this->id, $directRobots);
        }
        if(count($indirectRobots)) {
            Redis::sadd('today_indirect_robot'. $this->id, $indirectRobots);
        }
        if(count($teamRobots)) {
            Redis::sadd('today_team_robot'. $this->id, $teamRobots);
        }
        // Redis::sadd('today_team_robot_total'. $this->id, $teamRobotTotals);
    }

    /**
     * 入团
     *
     * @return void
     */
    public function joinTeam()
    {
        $superiors = $this->superiors();
        if (isset($superiors)) {
            foreach ($superiors as $index => $superior) {
                if ($index == TeamRole::DIRECT) {  //直推
                    Redis::sadd('direct_user' . $superior->id, $this->id);
                } else if ($index == TeamRole::INDIRECT) { //间推
                    Redis::sadd('indirect_user' . $superior->id, $this->id);
                } else {  //团队
                    Redis::sadd('team_user' . $superior->id, $this->id);
                }
            }
        }
    }

    /**
     * 退团
     *
     * @return void
     */
    public function quitTeam()
    {
        $superiors = $this->superiors();
        if (isset($superiors)) {
            foreach ($superiors as $index => $superior) {
                if ($index == TeamRole::DIRECT) {  //直推
                    Redis::srem('direct_user' . $superior->id, $this->id);
                } else if ($index == TeamRole::INDIRECT) { //间推
                    Redis::srem('indirect_user' . $superior->id, $this->id);
                } else {  //团队
                    Redis::srem('team_user' . $superior->id, $this->id);
                }
            }
        }
    }
}

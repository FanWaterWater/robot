<?php

namespace App\Models;

use App\Utils\FundType;
use App\Utils\TeamRole;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;
use Illuminate\Database\Eloquent\SoftDeletes;

class Robot extends Model
{
    use SoftDeletes;

    public static function boot()
    {
        parent::boot();

        static::created(function ($model) {
            $model->addTeamRobot();
        });

        static::deleted(function ($model) {
            $model->delTeamRobot();
        });
    }

    public function user()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    /**
     * 添加机器
     *
     * @param [type] $userId
     * @return void
     */
    public static function add($userId, $addType = 0)
    {
        $config = Cache::get('robot_config');
        $robot = [
            'user_id' => $userId,
            'type' => $config['type'],
            'robot_no' => getRobotOrderNo(),
            'start_time' => now(),
            'end_time' => now(),
            'add_type' => $addType
        ];
        if ($config['type'] == 1) {
            $robot['end_time'] = Carbon::now()->addDays($config->limit)->toDateTimeString();
        }
        return Robot::create($robot);
    }


    /**
     * 邀请用户机器奖励
     *
     * @return void
     */
    public function inviteIncomeReward()
    {
        $user = User::find($this->user_id);
        $superiors = $user->superiors();
        if (isset($superiors)) {
            foreach ($superiors as $index => $superior) {
                if ($index == TeamRole::DIRECT) {  //直推
                    $superior->incomeReward(TeamRole::DIRECT);
                } else if ($index == TeamRole::INDIRECT) { //间推
                    $superior->incomeReward(TeamRole::INDIRECT);
                } else {  //
                    break;
                }
            }
        }
    }

    /**
     * 添加团队机器
     *
     * @return void
     */
    public function addTeamRobot()
    {
        $user = User::find($this->user_id);
        Redis::sadd('robot' . $user->id, $this->id);
        Redis::zincrby('robot', 1, $this->id);
        //获取所有上级
        $superiors = $user->superiors();
        if (isset($superiors)) {
            foreach ($superiors as $index => $superior) {
                if ($index == TeamRole::DIRECT) {  //直推
                    Redis::sadd('direct_robot' . $superior->id, $this->id);
                    Redis::zincrby('direct_robot', 1, $this->id);
                    $superior->incomeReward(TeamRole::DIRECT);
                } else if ($index == TeamRole::INDIRECT) { //间推
                    Redis::sadd('indirect_robot' . $superior->id, $this->id);
                    Redis::zincrby('indirect_robot', 1, $this->id);
                    $superior->incomeReward(TeamRole::INDIRECT);
                } else {  //团队
                    Redis::sadd('team_robot' . $superior->id, $this->id);
                    Redis::zincrby('team_robot', 1, $this->id);
                }
                Redis::sadd('team_robot_total' . $superior->id, $this->id);
                Redis::zincrby('team_robot_total', 1, $this->id);
            }
        }
    }

    /**
     * 删除团队机器
     *
     * @return void
     */
    public function delTeamRobot()
    {
        $user = User::find($this->user_id);
        Redis::srem('robot' . $user->id, $this->id);
        //获取所有上级
        $superiors = $user->superiors();
        if (isset($superiors)) {
            foreach ($superiors as $index => $superior) {
                if ($index == TeamRole::DIRECT) {  //直推
                    Redis::srem('direct_robot' . $superior->id, $this->id);
                    Redis::zincrby('direct_robot', -1, $this->id);
                } else if ($index == TeamRole::INDIRECT) { //间推
                    Redis::srem('indirect_robot' . $superior->id, $this->id);
                    Redis::zincrby('indirect_robot', -1, $this->id);
                } else {  //团队
                    Redis::srem('team_robot' . $superior->id, $this->id);
                    Redis::zincrby('team_robot', -1, $this->id);
                }
                Redis::srem('team_robot_total' . $superior->id, $this->id);
                Redis::zincrby('team_robot_total', -1, $this->id);
            }
        }
    }
}

<?php

namespace App\Models;

use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Utils\TeamRole;
use Illuminate\Support\Facades\Redis;

class User extends Authenticatable implements JWTSubject
{
    protected $table = 'users';
    protected $guarded = [];
    protected $hidden = ['password'];
    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
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
     * 入团
     *
     * @return void
     */
    public function joinTeam()
    {
        $superiors = $this->superiors();
        foreach ($superiors as $index => $superior) {
            if ($index == TeamRole::DIRECT) {  //直推
                Redis::sadd('direct_user' . $superior->id, $this->id);
            } else if ($index == TeamRole::INDIRECT) { //间推
                Redis::sadd('indirect_user' . $superior->id, $this->id);
            }else {  //团队
                Redis::sadd('team_user' . $superior->id, $this->id);
            }
        }
    }
}

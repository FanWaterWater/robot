<?php

namespace App\Models;

use Illuminate\Support\Facades\Redis;

class Level extends Model
{
    public function getIncomeRewardAttribute($value)
    {
        return json_decode($value, true);
    }

    public function getUpgradeAttribute($value)
    {
        return json_decode($value, true);
    }

    // public function setIncomeRewardAttribute($value)
    // {
    //     return json_encode($value);
    // }

    // public function setUpgradeAttribute($value)
    // {
    //     return json_encode($value);
    // }

    public static function getLevels()
    {
        $levels = self::orderBy('sort', 'asc')->get();
        return $levels;
    }

    public static function getCurrentLevelIndex($levelId)
    {
        $userlevel = 0;
        $levels = self::orderBy('sort', 'asc')->get();
        foreach ($levels as $key => $level) {
            if ($levelId == $level->id) {
                $userlevel = $key;
                break;
            }
        }
        return $userlevel;
    }

    /**
     * 是否可升级
     *
     * @param [type] $userId
     * @return boolean
     */
    public static function isUpgrade($userId)
    {
        $user = User::find($userId);
        $levels = self::getLevels();
        $holdRobotCount = Redis::scard('robot' . $user->id);
        $directRobotCount = Redis::scard('direct_robot' . $user->id);
        $indirectRobotCount = Redis::scard('indirect_robot' . $user->id);
        $teamRobotCount = Redis::scard('team_robot_total' . $user->id);
        foreach ($levels as $level) {
            if ($level->id != $user->levelId) {
                if ($level->upgrade->hold >= $holdRobotCount && $level->upgrade->direct >= $directRobotCount && $level->upgrade->indirect >= $indirectRobotCount && $level->upgrade->team >= $teamRobotCount) {
                    $user->level_id = $level->id;
                 }
            }
        }
        $user->save();
    }
}

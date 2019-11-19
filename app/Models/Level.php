<?php

namespace App\Models;

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

    public static function isUpgrade()
    {

    }
}

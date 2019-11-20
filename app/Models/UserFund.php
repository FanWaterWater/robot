<?php

namespace App\Models;

use App\Utils\FundType;

class UserFund extends Model
{
    public function user()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    // public function getTypeAttribute($value)
    // {
    //     switch ($value) {
    //         case FundType::BUY_ROBOT:
    //             $value = '激活机器';
    //             break;
    //         case FundType::ROBOT_INCOME:
    //             $value = '机器收益';
    //             break;
    //         case FundType::INVITE_INCOME:
    //             $value = '邀请奖励';
    //             break;
    //         case FundType::WITHDRAW:
    //             $value = '提现';
    //             break;
    //         default:
    //             break;
    //     }
    //     return $value;
    // }
}

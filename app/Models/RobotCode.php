<?php

namespace App\Models;

class RobotCode extends Model
{
    public static function generateCode($length = 8)
    {
        return str_random($length);
    }

    public function user()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function robot()
    {
        return $this->hasOne(Robot::class, 'id', 'robot_id');
    }
}

<?php

namespace App\Models;

class VipCode extends Model
{
    public static function generateCode($length = 8)
    {
        return str_random($length);
    }

    public function user()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function level()
    {
        return $this->hasOne(Level::class, 'id', 'level_id')->select('id', 'name');
    }
}

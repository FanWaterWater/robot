<?php

namespace App\Models;

class Robot extends Model
{
    public function user()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }
}

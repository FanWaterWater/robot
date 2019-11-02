<?php

namespace App\Models;

class Withdraw extends Model
{
    public function user()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }
}

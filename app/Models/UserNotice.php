<?php

namespace App\Models;

class UserNotice extends Model
{
    public function notice()
    {
        return $this->hasOne(Notice::class, 'id', 'notice_id');
    }

    public static function add($userId, $noticeId)
    {
        self::create(['user_id' => $userId, 'notice_id' => $noticeId]);
    }
}

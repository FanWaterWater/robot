<?php

namespace App\Models;

use Illuminate\Support\Facades\Cache;

class RobotConfig extends Model
{
    public static function boot()
    {
        parent::boot();

        static::created(function ($model) {
            $config = self::whereDate('date', date('Y-m-d'))->first();
            Cache::forever('robot_config', $config);
        });
    }
}

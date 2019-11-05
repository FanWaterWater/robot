<?php

namespace App\Models;

use Illuminate\Support\Facades\Cache;

class RobotConfig extends Model
{
    public static function boot()
    {
        parent::boot();

        static::created(function ($model) {
            Cache::forever('robot_config', $model);
        });
    }
}

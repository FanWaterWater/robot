<?php

namespace App\Models;

use Illuminate\Support\Facades\Cache;

class Config extends Model
{
    protected $table = 'configs';

    protected $hidden = ['created_at', 'updated_at'];

    public static function boot()
    {
        parent::boot();

        static::saved(function ($model) {
            $configs = self::getByFlag();
            Cache::forever('system_config', $configs);
        });
    }

    public static function getByFlag()
    {
        $data =  [];
        $configs = self::get();
        foreach($configs as $config) {
            if($config->type == 0) {
                $data[$config->flag] = $config['int_param'];
            } else {
                $data[$config->flag] = $config['string_param'];
            }
        }
        return $data;
    }

    public static function getFormat()
    {
        $data =  [];
        $configs = self::get();
        foreach($configs as $config) {
            $data[$config->flag] = $config;
        }
        return $data;
    }
}

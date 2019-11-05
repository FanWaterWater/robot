<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

class RobotOrder extends Model
{
    use SoftDeletes;

    protected $dates = ['deleted_at'];
}

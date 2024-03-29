<?php

namespace App\Http\Controllers\Api\Backend;

use App\Models\User;
use App\Models\Robot;
use Illuminate\Http\Request;
use App\Models\RobotStatistics;
use App\Models\RegisterStatistics;
use App\Http\Controllers\Controller;

class IndexController extends Controller
{
    public function index()
    {
        $todayRegisterCount = User::where('add_type', 1)->whereDate('created_at', date('Y-m-d'))->count();
        $registerCount = User::where('add_type', 1)->whereDate('created_at', date('Y-m-d'))->count();
        $todayRobotCount = Robot::whereDate('created_at', date('Y-m-d'))->count();
        $robotCount = Robot::count();
        $amountCount = User::sum('amount');
        return success(compact('todayRegisterCount', 'registerCount', 'todayRobotCount', 'robotCount', 'amountCount'));
    }

    public function registerStatistics()
    {
        $data = RegisterStatistics::paginate(config('common.pagesize'));
        return success($data);
    }

    public function robotStatistics()
    {
        $data = RobotStatistics::paginate(config('common.pagesize'));
        return success($data);
    }
}

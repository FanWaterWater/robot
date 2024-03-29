<?php

namespace App\Http\Controllers\Api\Backend;

use App\Models\User;
use App\Models\Robot;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\RobotConfig;

class RobotController extends Controller
{
    public function index(Request $request)
    {
        $pagesize = $request->limit ?? config('common.pagesize');
        $robotNo = $request->robot_no;
        $addType = $request->add_type ?? -1;
        $startDate = $request->startDate;
        $endDate = $request->endDate ? $request->endDate . ' 23:59:59' : null;
        $userId = -1;
        if($request->username) {
            $user = User::where('username', $request->username)->first(['id']);
            $userId = isset($user) ? $user->id : 0;
        }
        $robots = Robot::when($userId > -1, function ($query) use ($userId) {
            return $query->where('user_id', $userId);
        })->when($robotNo, function ($query) use ($robotNo) {
            return $query->where('robot_no', $robotNo);
        })->when($addType > -1, function ($query) use ($addType) {
            return $query->where('add_type', $addType);
        })->when($startDate, function ($query) use ($startDate) {
            return $query->where('start_time', '>=', $startDate);
        })->when($endDate, function ($query) use ($endDate) {
            return $query->where('start_time', '<=', $endDate);
        })->with('user:id,username')->orderBy('id', 'desc')->paginate($pagesize);
        return success($robots);
    }

    public function show(Request $request, $id)
    {
        $robot = Robot::find($id);
        return success($robot);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        if (Robot::create($data)) {
            return success();
        }
        return error();
    }

    public function update(Request $request, $id)
    {
        $data = $request->all();
        if (Robot::find($id)->update($data)) {
            return success();
        }
        return error();
    }

    public function destroy(Request $request, $id)
    {
        if (Robot::find($id)->delete()) {
            return success();
        }
        return error();
    }

    /**
     * 获取配置
     *
     * @return void
     */
    public function config()
    {
        $config = RobotConfig::first();
        return success($config);
    }

    /**
     * 更新配置
     *
     * @param Request $request
     * @param [type] $id
     * @return void
     */
    public function updateConfig(Request $request)
    {
        $data = $request->all();
        if (RobotConfig::find($request->id)->update($data)) {
            return success();
        }
        return error();
    }
}

<?php

namespace App\Http\Controllers\Api\Backend;

use App\Models\RobotConfig;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class RobotConfigController extends Controller
{
    public function index(Request $request)
    {
        $pagesize = $request->limi ?? config('common.pagesize');
        $robotConfigs = RobotConfig::orderBy('id', 'desc')->paginate($pagesize);
        return success($robotConfigs);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $robotConfig = RobotConfig::create($data);
        if (isset($robotConfig)) {
            return success($robotConfig);
        }
        return error();
    }

    public function show($id)
    {
        $robotConfig = RobotConfig::find($id);
        return success($robotConfig);
    }

    public function update(Request $request, $id)
    {
        $data = $request->all();
        if (RobotConfig::where('id', $id)->update($data)) {
            return success();
        }
        return error();
    }

    public function destroy($id)
    {
        if (RobotConfig::where('id', $id)->delete()) {
            return success();
        }
        return error();
    }

    public function currentConfig()
    {
        return success(RobotConfig::orderBy('id', 'desc')->first());
    }
}

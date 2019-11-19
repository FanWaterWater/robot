<?php

namespace App\Http\Controllers\Api\Backend;

use App\Models\Level;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class LevelController extends Controller
{
    public function index()
    {
        $pagesize = request('limit') ?? config('common.pagesize');
        $levels = Level::orderBy('sort', 'asc')->paginate($pagesize);
        return success($levels);
    }

    public function show(Request $request, $id)
    {
        $level = Level::find($id);
        return success($level);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['income_reward'] = json_encode($data['income_reward']);
        $data['upgrade'] = json_encode($data['upgrade']);
        if (Level::create($data)) {
            return success();
        }
        return error();
    }

    public function update(Request $request, $id)
    {
        $data = $request->all();
        $data['income_reward'] = json_encode($data['income_reward']);
        $data['upgrade'] = json_encode($data['upgrade']);
        if (Level::find($id)->update($data)) {
            return success();
        }
        return error();
    }

    public function destroy(Request $request, $id)
    {
        if (Level::find($id)->delete()) {
            return success();
        }
        return error();
    }
}

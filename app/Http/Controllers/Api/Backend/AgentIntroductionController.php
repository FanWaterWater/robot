<?php

namespace App\Http\Controllers\Api\Backend;

use Illuminate\Http\Request;
use App\Models\AgentIntroduction;
use App\Http\Controllers\Controller;

class AgentIntroductionController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->limit;
        $title = $request->title;
        $orderBy = $request->orderBy ? 'asc' : 'desc';
        $agents = AgentIntroduction::when($title, function ($query) use ($title) {
            return $query->where('title', 'like', '%' . $title . '%');
        })->orderBy('id', $orderBy)->paginate($limit);
        return success($agents);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $agent = AgentIntroduction::create($data);
        if (isset($agent)) {
            return success();
        }
        return error();
    }

    public function show($id)
    {
        $agent = AgentIntroduction::find($id);
        return success($agent);
    }

    public function update(Request $request, $id)
    {
        $data = $request->all();
        if (AgentIntroduction::where('id', $id)->update($data)) {
            return success();
        }
        return error();
    }

    public function destroy($id)
    {
        if (AgentIntroduction::where('id', $id)->delete()) {
            return success();
        }
        return error();
    }
}

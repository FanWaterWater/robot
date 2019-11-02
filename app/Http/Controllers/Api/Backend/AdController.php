<?php

namespace App\Http\Controllers\Api\Backend;

use App\Models\Ad;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AdController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->limit;
        $title = $request->title;
        $orderBy = $request->orderBy ? 'asc' : 'desc';
        $videos = Ad::when($title, function ($query) use ($title) {
            return $query->where('title', 'like', '%' . $title . '%');
        })->orderBy('id', $orderBy)->paginate($limit);
        return success($videos);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $video = Ad::create($data);
        if (isset($video)) {
            return success();
        }
        return error();
    }

    public function show($id)
    {
        $video = Ad::find($id);
        return success($video);
    }

    public function update(Request $request, $id)
    {
        $data = $request->all();
        if (Ad::where('id', $id)->update($data)) {
            return success();
        }
        return error();
    }

    public function destroy($id)
    {
        if (Ad::where('id', $id)->delete()) {
            return success();
        }
        return error();
    }

    public function batchDel(Request $request)
    {
        $ids = json_decode($request->ids, true);
        if (Ad::whereIn('id', $ids)->delete()) {
            return success();
        }
        return error();
    }
}

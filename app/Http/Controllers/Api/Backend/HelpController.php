<?php

namespace App\Http\Controllers\Api\Backend;

use App\Models\Help;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class HelpController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->limit;
        $title = $request->title;
        $orderBy = $request->orderBy ? 'asc' : 'desc';
        $helps = Help::when($title, function ($query) use ($title) {
            return $query->where('title', 'like', '%' . $title . '%');
        })->orderBy('created_at', $orderBy)->paginate($limit);
        return success($helps);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $help = Help::create($data);
        if (isset($help)) {
            return success();
        }
        return error();
    }

    public function show($id)
    {
        $help = Help::find($id);
        return success($help);
    }

    public function update(Request $request, $id)
    {
        $data = $request->all();
        if (Help::where('id', $id)->update($data)) {
            return success();
        }
        return error();
    }

    public function destroy($id)
    {
        if (Help::where('id', $id)->delete()) {
            return success();
        }
        return error();
    }

    public function batchDel(Request $request)
    {
        $ids = json_decode($request->ids, true);
        if (Help::whereIn('id', $ids)->delete()) {
            return success();
        }
        return error();
    }
}

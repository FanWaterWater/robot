<?php

namespace App\Http\Controllers\Api\Backend;

use App\Models\Notice;
use App\Jobs\SendNotice;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class NoticeController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->limit;
        $title = $request->title;
        $orderBy = $request->orderBy ? 'asc' : 'desc';
        $notices = Notice::when($title, function ($query) use ($title) {
            return $query->where('title', 'like', '%' . $title . '%');
        })->orderBy('created_at', $orderBy)->paginate($limit);
        return success($notices);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $notice = Notice::create($data);
        if (isset($notice)) {
            return success($notice);
        }
        return error();
    }

    public function show($id)
    {
        $notice = Notice::find($id);
        return success($notice);
    }

    public function update(Request $request, $id)
    {
        $data = $request->all();
        if (Notice::where('id', $id)->update($data)) {
            return success();
        }
        return error();
    }

    public function destroy($id)
    {
        if (Notice::where('id', $id)->delete()) {
            return success();
        }
        return error();
    }

    public function batchDel(Request $request)
    {
        $ids = json_decode($request->ids, true);
        if (Notice::whereIn('id', $ids)->delete()) {
            return success();
        }
        return error();
    }

    public function send(Request $request)
    {
        $id = $request->id;
        $notice = Notice::where('id', $id)->first();
        if (isset($notice) && $notice->status == 0) {
            SendNotice::dispatch($id);
            $notice->status = 1;
            $notice->save();
            return success();
        }
        return error();
    }
}

<?php

namespace App\Http\Controllers\Api\Backend;

use App\Models\SwiperGroup;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\SwiperGroupRequest;

class SwiperGroupController extends Controller
{
    public function index()
    {
        $groups = SwiperGroup::orderBy('display', 'desc')->get();

        return success($groups);
    }

    public function store(Request $request)
    {
        $data = request()->all();

        if (SwiperGroup::create($data)) {
            return success();
        }

        return error();
    }

    public function show()
    {
        $group = SwiperGroup::find(request()->swiper_group)->load('swipers');
        if($group) {
            return success($group);
        }
        return error();
    }

    public function update(Request $request)
    {
        // TODO:判断更新权限
        // SwiperGroup::update(['display' => 0]);

        $data = request()->all();

        if (SwiperGroup::where('id', request()->swiper_group)->update($data)) {
            return success();
        }

        return error();
    }

    public function destroy()
    {
        // TODO:判断删除权限
        if (SwiperGroup::where('id', request()->swiper_group)->delete()) {
            return success();
        }

        return error();
    }

    public function change()
    {
        SwiperGroup::where('display', 1)->update(['display' => 0]);

        if (SwiperGroup::where('id', request()->swiper_group)->update(['display' => 1])) {
            return success();
        }

        return error();
    }

    public function display()
    {
        $group = SwiperGroup::where('display', 1)->first()->load('swipers');
        return success($group);
    }
}

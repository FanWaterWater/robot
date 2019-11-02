<?php

namespace App\Http\Controllers\Api\Backend;

use App\Models\Swiper;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\SwiperRequest;

class SwiperController extends Controller
{
    public function index()
    {
        $swipers = Swiper::orderBy('sort', 'desc')->get();
        return success($swipers);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        if (Swiper::create($data)) {
            return success();
        }
        return error();
    }

    public function show()
    {
        $swiper = Swiper::find(request()->swiper);
        return success($swiper);
    }

    public function update(Request $request)
    {
        $data = $request->all();
        if (Swiper::where('id', request()->swiper)->update($data)) {
            return success();
        }

        return error();
    }

    public function destroy()
    {
        // TODO:判断删除权限
        if (Swiper::where('id', request()->swiper)->delete()) {
            return success();
        }
        return error();
    }

    public function display()
    {
        $swipers = Swiper::where('hidden', 0)->orderBy('sort', 'desc')->get();
        return success($swipers);
    }
}

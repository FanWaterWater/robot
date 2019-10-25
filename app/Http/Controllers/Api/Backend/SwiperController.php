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
        $swipers = Swiper::where('display', 1)->orderBy('created_at', 'asc')->get();

        return success($swipers);
    }

    public function store(Request $request)
    {
        $data = request([
            'url', 'remake', 'display', 'image', 'group'
        ]);
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

    public function update(SwiperRequest $request)
    {
        // TODO:判断更新权限

        $data = request([
            'url', 'remake', 'display', 'image', 'group'
        ]);

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
}

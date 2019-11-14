<?php

use App\Models\User;
use Illuminate\Support\Facades\Redis;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('test', function () {
    $arrs = range(0, 30);
    $count = 0;
    foreach ($arrs as $index => $arr) {
        $count += Redis::srem('robot' . $index, $arrs);
        $count += Redis::srem('direct_robot' . $index, $arrs);
        $count += Redis::srem('indirect_robot' . $index, $arrs);
        $count += Redis::srem('team_robot' . $index, $arrs);
        $count += Redis::srem('team_robot_total' . $index, $arrs);
    }
    return $count;
});

Route::get('user', function () {
    $userId = request('user_id');
    return Redis::smembers('team_robot_total' . $userId);
    // $user = User::find($userId);
    // return success($user->superiors());
});

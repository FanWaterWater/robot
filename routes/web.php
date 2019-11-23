<?php

use App\Models\User;
use App\Models\Robot;
use Endroid\QrCode\QrCode;
use Illuminate\Support\Facades\Redis;
use Intervention\Image\Facades\Image;

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

Route::get('pay-success', function () {
    $url = $_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['HTTP_HOST'] . '/mobile/paySuccess.html';
    return redirect($url);
});

Route::post('getSn', 'Api\AlipayController@getSn');

Route::get('test', function () {
    $users = User::get();
    foreach($users as $user) {
        Redis::srem('robot' . $user->id);
        Redis::srem('direct_robot' . $user->id);
        Redis::srem('indirect_robot' . $user->id);
        Redis::srem('team_robot' . $user->id);
        Redis::srem('team_robot_total' . $user->id);
        Redis::srem('direct_user' . $user->id);
        Redis::srem('indirect_user' . $user->id);
        Redis::srem('team_user' . $user->id);
    }
    return 'success';
});

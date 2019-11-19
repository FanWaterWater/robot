<?php

use App\Models\User;
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
    // Redis::zincrby('zset1', 1, 'ef');
    $dir = storage_path('app/public');
    $qrCode = new QrCode('Life is too short to be generating QR codes');
    $qrcode = public_path() .'/qrcode.png';
    $qrCode->writeFile($qrcode);
    $img = Image::make(public_path(). '/poster1.jpg')->resize(750, 1344);
    $img->insert($qrcode, 'bottom-right', 15, 10);
    $img->save($dir . '/poster.jpg');
});

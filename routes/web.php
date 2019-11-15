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

Route::get('pay-success', function () {
    $url = $_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['HTTP_HOST'] . '/mobile/paySuccess.html';
    return redirect($url);
});

Route::post('getSn', 'Api\AlipayController@getSn');

Route::get('test', function () {
    $publicKey = openssl_get_publickey('file:///Applications/XAMPP/xamppfiles/htdocs/robot/public/alipayCertPublicKey_RSA2.pem');
    dd($publicKey);
    if (is_resource($publicKey)) {
        return openssl_free_key($publicKey);
    }
    return 'success';
});

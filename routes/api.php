<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('upload', 'Api\UploadController@upload');

Route::get('config', function() {
    return success(Cache::get('system_config'));
});

Route::group(['prefix' => 'chat'], function () {
    Route::post('save', 'Api\ChatController@save');
    Route::post('load', 'Api\ChatController@load');
    Route::post('unRead', 'Api\ChatController@unRead');
});

Route::post('verification-code', 'Api\SmsController@verifyCode');


include_once('backend.php');
include_once('app.php');

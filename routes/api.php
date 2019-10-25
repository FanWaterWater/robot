<?php

use Illuminate\Http\Request;

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

Route::group(['prefix' => 'backend'], function () {
    Route::post('admins/login', 'Api\Backend\AdminController@login');
    Route::post('admins/logout', 'Api\Backend\AdminController@logout');
    Route::apiResource('admins', 'Api\Backend\AdminController');

    //vip激活码管理
    Route::get('vip-codes/export', 'Api\Backend\VipCodeController@export');  //导出
    Route::apiResource('vip-codes', 'Api\Backend\VipCodeController');

    //轮播图
    Route::apiResource('swipers', 'Api\Backend\SwiperController');
    //轮播图组
    Route::get('swiper-groups/{swiper-group}/change', 'Api\Backend\SwiperGroupController@change');
    Route::get('swiper-groups/display', 'Api\Backend\SwiperGroupController@display');
    Route::apiResource('swiper-groups', 'Api\Backend\SwiperGroupController');
    //帮助中心管理
    Route::post('helps/delete/batch', 'Api\Backend\HelpController@batchDel');
    Route::apiResource('helps', 'Api\Backend\HelpController');
    //公告管理
    Route::post('notices/send', 'Api\Backend\NoticeController@send');
    Route::post('notices/delete/batch', 'Api\Backend\NoticeController@batchDel');
    Route::apiResource('notices', 'Api\Backend\NoticeController');
    //公司介绍
    Route::apiResource('companys', 'Api\Backend\CompanyController');
    //代理商介绍
    Route::apiResource('agent-introductions', 'Api\Backend\AgentIntroductionController');
    //视频中心
    Route::post('videos/delete/batch', 'Api\Backend\VideoController@batchDel');
    Route::apiResource('videos', 'Api\Backend\VideoController');
    //弹窗设置
    Route::post('ads/delete/batch', 'Api\Backend\AdController@batchDel');
    Route::apiResource('ads', 'Api\Backend\AdController');
    //代理设置
    Route::apiResource('agents', 'Api\Backend\AgentController');
    //系统配置
    Route::apiResource('configs', 'Api\Backend\ConfigController');
});

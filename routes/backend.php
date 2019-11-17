<?php

Route::post('backend/admins/login', 'Api\Backend\AdminController@login');


Route::group(['prefix' => 'backend', 'middleware' => ['token.admin']], function () {
    Route::post('index', 'Api\Backend\IndexController@index');
    Route::get('index/register-statistics', 'Api\Backend\IndexController@RegisterStatistics');
    Route::get('index/robot-statistics', 'Api\Backend\IndexController@robotStatistics');

    Route::post('admins/logout', 'Api\Backend\AdminController@logout');
    Route::apiResource('admins', 'Api\Backend\AdminController');

    Route::apiResource('users', 'Api\Backend\UserController');
    //用户资金记录
    Route::get('user-funds', 'Api\Backend\UserFundController@index');
    //机器激活码管理
    Route::get('robot-codes/export', 'Api\Backend\RobotCodeController@export');  //导出
    Route::apiResource('robot-codes', 'Api\Backend\RobotCodeController');
    //机器管理
    Route::apiResource('robots', 'Api\Backend\RobotController');
    //机器配置
    Route::get('robot-configs/current', 'Api\Backend\RobotConfigController@currentConfig');
    Route::apiResource('robot-configs', 'Api\Backend\RobotConfigController');
    //轮播图
    Route::get('swipers/display', 'Api\Backend\SwiperController@display');
    Route::apiResource('swipers', 'Api\Backend\SwiperController');
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

    //等级设置
    Route::apiResource('levels', 'Api\Backend\LevelController');
    //提现申请
    Route::post('withdraws/{id}/verify', 'Api\Backend\WithdrawController@verify');
    Route::apiResource('withdraws', 'Api\Backend\WithdrawController');

});

<?php

Route::post('app/users/register', 'Api\App\UserController@register');
Route::post('app/users/login', 'Api\App\UserController@login');
Route::post('app/users/forget-password', 'Api\App\UserController@forgetPassword');
Route::get('app/users/user', 'Api\App\UserController@user');
Route::post('app/robots/buy', 'Api\App\RobotController@buy');
Route::get('app/robots/config', 'Api\App\RobotController@config');

Route::group(['prefix' => 'app', 'middleware' => ['token.user']], function () {

    Route::group(['prefix' => 'indexs'], function () {
        Route::get('index', 'Api\App\IndexController@index');
        Route::get('notices', 'Api\App\IndexController@notices');
        Route::get('notice-detail', 'Api\App\IndexController@noticeDetail');
        Route::get('helps', 'Api\App\IndexController@helps');
        Route::get('help-detail', 'Api\App\IndexController@helpDetail');

        Route::get('videos', 'Api\App\IndexController@videos');
        Route::get('agents', 'Api\App\IndexController@agents');
        Route::get('agents-by-type', 'Api\App\IndexController@agentsByType');

        Route::get('company-introduction', 'Api\App\IndexController@companyIntroduction');
        Route::get('agent-introduction', 'Api\App\IndexController@agentIntroduction');
        Route::get('ad', 'Api\App\IndexController@ad');
    });

    Route::group(['prefix' => 'teams'], function () {
        Route::get('index', 'Api\App\TeamController@index');
        Route::get('detail', 'Api\App\TeamController@detail');

    });

    Route::group(['prefix' => 'users'], function () {
        Route::get('info', 'Api\App\UserController@info');
        Route::get('fund', 'Api\App\UserController@fund');
        Route::post('withdraw', 'Api\App\UserController@withdraw');
        Route::post('edit-password', 'Api\App\UserController@editPassword');
        Route::post('edit-info', 'Api\App\UserController@editInfo');
        Route::post('bind-alipay', 'Api\App\UserController@bindAlipay');
        Route::post('bind-bank', 'Api\App\UserController@bindBank');
    });

    Route::group(['prefix' => 'robots'], function () {
        Route::get('index', 'Api\App\RobotController@index');
        Route::get('list', 'Api\App\RobotController@list');
        Route::post('buy', 'Api\App\RobotController@buy');
        Route::post('activate', 'Api\App\RobotController@activate');
    });
});

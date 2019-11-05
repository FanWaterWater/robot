<?php

Route::post('app/users/register', 'Api\App\UserController@register');
Route::post('app/users/login', 'Api\App\UserController@login');
Route::post('app/users/forget-password', 'Api\App\UserController@forgetPassword');
// Route::post('app/users/register', 'Api\App\UserController@register');


Route::group(['prefix' => 'app'], function () {
    Route::get('robots', 'Api\App\RobotController@index');
    Route::post('robots/buy', 'Api\App\RobotController@buy');
    Route::post('robots/activate', 'Api\App\RobotController@activate');
});


<?php

Route::post('app/users/register', 'Api\App\UserController@register');
Route::post('app/users/login', 'Api\App\UserController@login');
// Route::post('app/users/register', 'Api\App\UserController@register');


Route::group(['prefix' => 'app'], function () {

});


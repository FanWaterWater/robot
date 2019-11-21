<?php

Route::group(['prefix' => 'backend/export','middleware' => ['token.once']], function () {
    Route::get('robot-codes', 'Api\Backend\RobotCodeController@export');
});

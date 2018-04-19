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

// Item api
Route::middleware('auth:api')->resource('/setting', 'Api/SettingsController');

// R api
Route::middleware('auth:api')->resource('/setting', 'Api/SettingsController');

// Settings api
Route::middleware('auth:api')->resource('/setting', 'Api/SettingsController');

// User api
Route::middleware('auth:api')->resource('/user', 'Api/UserController');



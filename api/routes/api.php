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


Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'

], function ($router) {

    Route::post('login', 'AuthController@login');
    Route::post('logout', 'AuthController@logout');
    Route::post('refresh', 'AuthController@refresh');
    Route::post('me', 'AuthController@me');

});


// Item api
Route::middleware('auth:api')->resource('/setting', 'Api/SettingsController');

// R api
Route::middleware('auth:api')->resource('/setting', 'Api/SettingsController');

// Settings api

// User api
Route::middleware('auth:api')->resource('/user', 'Api/UserController');

Route::middleware('auth:api')->resource('/site', 'Api/SiteController');

Route::middleware('auth:api')->resource('/{site}', 'Api/SettingsController');




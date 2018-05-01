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

Route::group([
    'middleware' => [
        'auth:api',
        'site'
    ],
    'prefix' => '{site}'
], function ($router) {
    // Item api
    Route::resource('/item', 'Api/ItemController');
    // Relationship api
    Route::resource('/relationship', 'Api/RelationshipController');
    // Settings api
    Route::resource('/setting', 'Api/SettingsController');
    // User api
    Route::resource('/user', 'Api/UserController');
    // User api
    Route::resource('/user', 'Api/GroupController');
    // Comment api
    Route::resource('/comment', 'Api/CommentController');
    // Statistics api
    Route::resource('/statistics', 'Api/StatisticsController');
});

Route::group([
    'middleware' => [
        'auth:api',
        'site'
    ],
    'prefix' => 'admin'
], function ($router) {
    // Sites api
    Route::resource('/site', 'Api/SiteController');
    // Admin System Settings api
    Route::resource('/settings', 'Api/AdminSettingsController');
    // User api
    Route::resource('/user', 'Api/AdminUserController');
});






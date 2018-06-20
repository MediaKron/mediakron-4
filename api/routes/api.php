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
    //'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {

    Route::post('login', 'Api\AuthController@login');
    Route::post('logout', 'Api\AuthController@logout');
    Route::post('refresh', 'Api\AuthController@refresh');
    Route::post('reset', 'Api\AuthController@reset');
    Route::post('me', 'Api\AuthController@me');

});

Route::group([
    'middleware' => [
        //'auth:api',
        'admin'
    ],
    'prefix' => 'admin'
], function ($router) {

    // Sites api
    Route::resource('/site', 'Api\Admin\SiteController');

    // Admin System Settings api
    Route::resource('/settings', 'Api\Admin\SettingsController');

    // User api
    Route::resource('/user', 'Api\Admin\UserController');

    // Group api
    Route::resource('/group', 'Api\Admin\GroupController');
});



Route::group([
    'middleware' => [
        //'auth:api',
        'site'
    ],
    'prefix' => '{site}'
], function ($router) {
    // Item api
    Route::resource('/item', 'Api\ItemController');
    // Relationship api
    Route::resource('/relationship', 'Api\RelationshipController');
    // Comment api
    Route::resource('/comment', 'Api\CommentController');
    // Statistics api
    Route::resource('/statistics', 'Api\StatisticsController');
    // Settings api
    Route::resource('/settings', 'Api\SettingsController');
    // Settings api
    Route::resource('/', 'Api\SettingsController', [
        'names' => [
            'show' => 'settings.show'
        ]
    ]);
});





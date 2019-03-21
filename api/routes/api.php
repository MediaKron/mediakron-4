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
    Route::get('check', 'Api\AuthController@check');
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
    //'prefix' => 'admin'
], function ($router) {

    // Sites api
    Route::resource('site', 'Api\SiteController');
    Route::get('/sites', 'Api\SiteController@index');
    Route::post('/site/{site}', 'Api\SiteController@update');

    // Admin System Settings api
    Route::resource('/settings', 'Api\Admin\SettingsController');

    // User api
    Route::resource('/user', 'Api\Admin\UserController');
    Route::get('/users', 'Api\Admin\UserController@index');

    // Group api
    Route::resource('/group', 'Api\Admin\GroupController');
});



Route::resource('item', 'Api\ItemController');
Route::post('/item/{id}', 'Api\ItemController@update');
Route::get('/items', 'Api\ItemController@index');


Route::group([
    'middleware' => [
        //'auth:api',
        'site'
    ],
    'prefix' => '{site}'
], function ($router) {
     
    // Item api
    Route::get('/items', 'Api\ItemController@index');
    Route::post('/items/multiple', 'Api\ItemController@multiple');
    Route::post('/item/{id}', 'Api\ItemController@update');
    Route::resource('/item', 'Api\ItemController');

    Route::post('/upload/{type}', 'UploadController@upload');

    Route::get('/users', 'Api\SiteController@users');

    // Relationship api
    Route::resource('/relationship', 'Api\RelationshipController');
    // Comment api
    Route::resource('/comment', 'Api\CommentController');
    // Statistics api
    Route::resource('/statistics', 'Api\StatisticsController');
    // Settings api
    Route::resource('/settings', 'Api\SettingsController');
    // Settings api
    Route::get('/', 'Api\SettingsController@show')->name('site.setting.show' );
    Route::put('/', 'Api\SettingsController@update')->name('site.setting.update');
});





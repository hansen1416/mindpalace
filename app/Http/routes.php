<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return redirect()->route('home');
});

Route::get('/yang/home', ['as' => 'home', 'uses' => 'Yang\HomeController@index']);

Route::group(['prefix' => 'auth', 'namespace' => 'Auth'], function () {
    Route::post('auth/login', ['as' => 'login', 'uses' => 'AuthController@login']);
    Route::get('auth/login', ['as' => 'login', 'uses' => 'AuthController@login']);
    Route::post('auth/logout', ['as' => 'logout', 'uses' => 'AuthController@logout']);
    Route::get('auth/logout', ['as' => 'logout', 'uses' => 'AuthController@logout']);
});

Route::group(['prefix' => 'yang', 'namespace' => 'Yang', 'middleware' => 'auth:web'], function () {
    Route::get('space', ['as' => 'space', 'uses' => 'SpaceController@index']);
    Route::post('space/createCtg', ['as' => 'createCtg', 'uses' => 'SpaceController@createCtg']);
    Route::post('space/updateCtg', ['as' => 'updateCtg', 'uses' => 'SpaceController@updateCtg']);
    Route::post('space/moveCtg', ['as' => 'moveCtg', 'uses' => 'SpaceController@moveCtg']);
    Route::post('space/getCtgDetail', ['as' => 'ctgDetail', 'uses' => 'SpaceController@getCtgDetail']);
    Route::post('space/getAllTheme', ['as' => 'themes', 'uses' => 'SpaceController@getAllTheme']);
    Route::get('space/changeTheme', ['as' => 'changeTheme', 'uses' => 'SpaceController@changeTheme']);
});

Route::auth();




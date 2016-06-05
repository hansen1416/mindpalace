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

Route::controllers([
                       'auth' => 'Auth\AuthController',
                       'password' => 'Auth\PasswordController',
                   ]);
Route::group(['prefix' => 'yang', 'namespace' => 'Yang', 'middleware' => 'auth'], function()
{
    Route::get('space',              ['as' => 'space',   'uses' => 'SpaceController@index']);
    Route::post('space/createCtg',   ['as' => 'createCtg',  'uses' => 'SpaceController@createCtg']);
    Route::post('space/updateCtg',   ['as' => 'updateCtg',  'uses' => 'SpaceController@updateCtg']);
    Route::post('space/createItem',  ['as' => 'createItem', 'uses' => 'SpaceController@createItem']);
    Route::post('space/updateItem',  ['as' => 'updateItem', 'uses' => 'SpaceController@updateItem']);
});

Route::auth();


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
    return view('yang.home.index');
});

Route::controllers([
                       'auth' => 'Auth\AuthController',
                       'password' => 'Auth\PasswordController',
                   ]);
Route::group(['prefix' => 'yang', 'namespace' => 'Yang', 'middleware' => 'auth'], function()
{
    Route::get('home',                  ['as' => 'home',            'uses' => 'HomeController@index']);
    Route::get('universe',              ['as' => 'universeIndex',   'uses' => 'UniverseController@index']);
    Route::post('universe/createCtg',   ['as' => 'createCtg',       'uses' => 'UniverseController@createCtg']);
    Route::post('universe/updateCtg',   ['as' => 'updateCtg',       'uses' => 'UniverseController@updateCtg']);
    Route::post('universe/createItem',  ['as' => 'createItem',      'uses' => 'UniverseController@createItem']);
    Route::post('universe/updateItem',  ['as' => 'updateItem',      'uses' => 'UniverseController@updateItem']);
});

Route::auth();


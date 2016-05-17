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

Route::get('/', 'WelcomeController@index');

Route::get('home', 'HomeController@index');

Route::controllers([
	'auth' => 'Auth\AuthController',
	'password' => 'Auth\PasswordController',
]);

Route::group(['prefix' => 'yang', 'namespace' => 'Yang'], function()  
{
	Route::get('universe',          ['as' => 'universeIndex',   'uses' => 'UniverseController@index']);
	Route::post('universe/create',  ['as' => 'universeCreate',  'uses' => 'UniverseController@create']);
	Route::post('universe/update',  ['as' => 'universeUpdate',  'uses' => 'UniverseController@update']);
});
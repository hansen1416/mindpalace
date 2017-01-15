<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your application. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
*/
//
Route::get('/', function () {
    return view('welcome');
});

//Route::get('/', 'WelcomeController@index');
Auth::routes();

Route::get('/home', 'WelcomeController@index');


Route::get('/ctg/move/space/{space_id}/ctg/{ctg_id}/pid/{pid}', 'Api\CtgController@moveCtg');
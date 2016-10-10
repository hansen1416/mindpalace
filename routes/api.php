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

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:api');


Route::group([
                 'namespace' => 'Api',
                 'prefix'    => 'api',
             ],
    function () {
        Route::get('login', 'LoginController@showLoginForm');
        Route::post('login', 'LoginController@login');
        Route::get('home', 'CtgController@home');
    });


Route::group([
                 'namespace'  => 'Api',
                 'middleware' => 'auth:api',
             ],
    function () {
        Route::get('home', function () {
            echo 'home';
        });
    });

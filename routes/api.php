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

/**
 * handle the preflight options request,
 * just return 204 no Content
 */
Route::options('{all}', function () {
    return response('', 204);
})->where('all', '.*');


Route::group([
                 'namespace' => 'Api',
                 'prefix'    => 'api',
                 'middleware' => 'public',
             ],
    function () {
        Route::post('login', 'LoginController@login');
        Route::get('home', 'SpaceController@home');
        Route::get('update', 'SpaceController@update');
    });


Route::group([
                 'namespace'  => 'Api',
                 'prefix'     => 'api',
                 'middleware' => 'auth:api',
             ],
    function () {
        Route::get('user', 'UserController@profile');
    });

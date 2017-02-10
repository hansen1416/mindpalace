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
             ],
    function () {
        Route::post('login', 'LoginController@login');
        Route::get('home', 'SpaceController@home');
        Route::get('create', 'SpaceController@create');
        Route::post('space/search', 'SpaceController@search');
        Route::get('space/{space_id}/ctg/{ctg_id?}', 'CtgController@spaceCtg')
             ->where('space_id', '[0-9]+')
             ->where('ctg_id', '[0-9]+');
        Route::get('ctg/content/{ctg_id?}', 'CtgController@ctgContent')
             ->where('ctg_id', '[0-9]+');
    });


Route::group([
                 'namespace'  => 'Api',
                 'prefix'     => 'api',
                 'middleware' => ['auth:api'],
             ],
    function () {
        Route::get('user', 'UserController@profile');
        Route::post('space/create', 'SpaceController@create');
        Route::get('ctg/move/space/{space_id}/ctg/{ctg_id}/pid/{pid}', 'CtgController@moveCtg')
             ->where('space_id', '[0-9]+')
             ->where('ctg_id', '[0-9]+')
             ->where('pid', '[0-9]+');
        Route::post('ctg/saveCtgContent', 'CtgController@saveCtgContent');
        Route::post('ctg/createCtg', 'CtgController@createCtg');
        Route::post('space/fetchUrl', 'SpaceController@fetchUrl');
    });

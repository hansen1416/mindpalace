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
        Route::post('register', 'RegisterController@register');
        Route::post('login', 'LoginController@login');
        Route::get('login/github', 'LoginController@redirectToProvider');
        Route::get('login/github/callback', 'LoginController@handleProviderCallback');
        Route::get('home', 'SpaceController@home');
        Route::get('create', 'SpaceController@create');
        Route::post('space/search', 'SpaceController@search');
        Route::get('space/{space_id}/ctg/{ctg_id?}', 'CtgController@spaceCtg')
             ->where('space_id', '[0-9]+')
             ->where('ctg_id', '[0-9]+');
        Route::get('space/{space_id?}', 'SpaceController@space')
             ->where('space_id', '[0-9]+');
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
        Route::post('profile/update', 'UserController@updateUserProfile');
        Route::post('user/search', 'UserController@search');
        Route::post('space/create', 'SpaceController@create');
        Route::get('ctg/move/space/{space_id}/ctg/{ctg_id}/pid/{pid}', 'CtgController@moveCtg')
             ->where('space_id', '[0-9]+')
             ->where('ctg_id', '[0-9]+')
             ->where('pid', '[0-9]+');
        Route::post('ctg/saveCtgContent', 'CtgController@saveCtgContent');
        Route::post('ctg/createCtg', 'CtgController@createCtg');
        Route::get('ctg/delete/space/{space_id}/ctg/{ctg_id}', 'CtgController@deleteCtg')
             ->where('space_id', '[0-9]+')
             ->where('ctg_id', '[0-9]+');
        Route::post('friends/create', 'FriendsController@create');
        Route::get('friends/lists', 'FriendsController@lists');
        Route::post('ctg/link', 'CtgController@linkCtg');
    });

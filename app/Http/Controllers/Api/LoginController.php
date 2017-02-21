<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
//use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Auth;
use Route;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

//    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/home';

    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
    }


    protected function guard()
    {
        return Auth::guard('api');
    }


    protected function login(Request $request)
    {

        $email    = $request->input('email');
        $password = $request->input('password');

        $request->request->add([
                                   'username'      => $email,
                                   'password'      => $password,
                                   'grant_type'    => 'password',
                                   'client_id'     => env('API_CLIENT_ID'),
                                   'client_secret' => env('API_CLIENT_SECRET'),
                                   'scope'         => '*',
                               ]);

        $tokenRequest = Request::create(
            '/oauth/token',
            'post'
        );

        return Route::dispatch($tokenRequest)->getContent();
    }


    /**
     * @param Request $request
     * @return mixed
     */
    protected function refreshToken(Request $request)
    {
        $request->request->add([
                                   'grant_type'    => 'refresh_token',
                                   'refresh_token' => $request->refresh_token,
                                   'client_id'     => env('API_CLIENT_ID'),
                                   'client_secret' => env('API_CLIENT_SECRET'),
                               ]);

        $proxy = Request::create(
            '/oauth/token',
            'POST'
        );

        return Route::dispatch($proxy);
    }


    protected function logout(Request $request)
    {
        Auth::logout();

        return response()->json([]);
    }


}

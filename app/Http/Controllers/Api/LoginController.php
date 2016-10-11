<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Auth;

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

    use AuthenticatesUsers;

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
        $this->middleware('guest', ['except' => 'logout']);
    }


    protected function guard()
    {
        return Auth::guard('api');
    }


    public function showLoginForm()
    {
        echo 'login-form';
    }


    protected function authenticated(){

    }


    public function login(Request $request)
    {
//        $email    = $request->input('email');
//        $password = $request->input('password');
//
//        $g = Auth::guard('api')->attempt(['email' => $email, 'password' => $password]);
        return response('123');

    }


}

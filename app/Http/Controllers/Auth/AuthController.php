<?php
namespace App\Http\Controllers\Auth;

use App\User;
use Illuminate\Http\Response;
use Validator;
use Auth;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Registration & Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users, as well as the
    | authentication of existing users. By default, this controller uses
    | a simple trait to add these behaviors. Why don't you explore it?
    |
    */
    use AuthenticatesAndRegistersUsers, ThrottlesLogins;
    /**
     * Where to redirect users after login / registration.
     *
     * @var string
     */
    protected $redirectTo = '/';

    /**
     * Create a new authentication controller instance.
     *
     * @return mixed
     */
    public function __construct()
    {
        $this->middleware($this->guestMiddleware(), ['except' => 'logout']);
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => 'required|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|min:6|confirmed',
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     * @param array $data
     * @throws \Exception
     * @return object
     */
    protected function create(array $data)
    {

        /**
         * 开启事务
         * 创建用户信息
         * 同时创建用户详情
         */
        DB::beginTransaction();

        try {
            // Validate, then create if valid
            $user = User::create([
                                     'name' => $data['name'],
                                     'email' => $data['email'],
                                     'password' => bcrypt($data['password']),
                                 ]);

        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }

        try {

            $user->profile()->create([
                                         'portrait' => config('view.default_portrait'),
                                     ]);

        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }


        DB::commit();

        return $user;

    }

    /**
     * 用户验证
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {

        $login_staus = Auth::guard('web')->attempt(['email' => $request->email, 'password' => $request->password], $request->remember);

        if (!$login_staus) {

            return response()->json(['status' => false]);
        }

        return response()->json(['status' => true]);

    }

    /**
     * 登出
     * @return mixed
     */
    public function logout()
    {
        Auth::logout();

        return response()->json(['status' => true]);
    }


}

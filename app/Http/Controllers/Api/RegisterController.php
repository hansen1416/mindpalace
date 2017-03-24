<?php
/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 17-2-27
 * Time: 上午11:00
 */

namespace App\Http\Controllers\Api;

use Validator;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\RegistersUsers;
use Auth;
use Route;
use App\Services\Contract\UserServiceContract;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Registered;


class RegisterController extends Controller
{
    private $user;

    public function __construct(
        UserServiceContract $userServiceContract
    )
    {
        $this->user = $userServiceContract;
    }

    use RegistersUsers;

    protected function guard()
    {
        return Auth::guard('api');
    }

    /**
     * @param array $data
     * @return \Illuminate\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'email'    => 'bail|required|email|max:255|unique:users',
            'password' => 'bail|required|min:6|confirmed',
            'name'     => 'bail|required|max:255',
        ]);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|string
     */
    protected function register(Request $request)
    {
        $validator = $this->validator($request->all());

        if ($validator->fails()) {
            return $this->responseJson([
                                           'status' => 500,
                                           'error'  => $validator->errors()->all(),
                                       ]);
        }

        $user = $this->user->createUser($request->all());

        if (isset($user['status']) && $user['status'] == 500) {
            return $this->responseJson($user);
        }

        event(new Registered($user));

        $toLogin = Request::create(
            '/api/login',
            'post'
        );

        return Route::dispatch($toLogin)->getContent();
    }


}
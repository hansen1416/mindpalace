<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-10-27
 * Time: 上午10:43
 */

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Contract\UserServiceContract;
use Illuminate\Http\Request;

class UserController extends Controller
{

    public $user;

    public function __construct(
        UserServiceContract $userServiceContract
    )
    {
        $this->user = $userServiceContract;
    }


    public function profile(Request $request)
    {
        $user=$request->user();

        unset($user->name);

        return $user;
    }


}
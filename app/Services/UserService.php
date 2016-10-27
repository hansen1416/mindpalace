<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-10-27
 * Time: 上午11:13
 */

namespace App\Services;

use App\Services\Contract\UserServiceContract;
use App\Repositories\Contract\UserRepositoryContract;
use Auth;

class UserService implements UserServiceContract
{
    protected $userRepo;

    public function __construct(
        UserRepositoryContract $userRepositoryContract
    )
    {
        $this->userRepo = $userRepositoryContract;
    }


    public function userProfile()
    {
//        $user = Auth::guard('api')->user();
//        $user->profile;
//        $user->space;
        return $this->userRepo->userProfile(Auth::guard('api')->user()->user_id);
    }


}
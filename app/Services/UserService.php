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
use App\Repositories\Contract\ProfileRepositoryContract;
use Auth;

class UserService implements UserServiceContract
{
    protected $userRepo;

    protected $profileRepo;

    public function __construct(
        UserRepositoryContract $userRepositoryContract,
        ProfileRepositoryContract $profileRepositoryContract
    )
    {
        $this->userRepo    = $userRepositoryContract;
        $this->profileRepo = $profileRepositoryContract;
    }


    public function userId()
    {
        return Auth::guard('api')->user() ? Auth::guard('api')->user()->user_id : 0;
    }


    public function userProfile()
    {
//        $user = Auth::guard('api')->user();
//        $user->profile;
//        $user->space;
        return $this->userRepo->userProfile($this->userId());
    }


    public function updateUserProfile(array $profile)
    {
        $user = Auth::guard('api')->user();

        if (!$user) {
            return 401;
        }

        $res = $this->profileRepo->updateUserProfile($user->profile->profile_id, $profile);

        if ($res[0]) {
            return $profile;
        } else {
            return 500;
        }
    }


}
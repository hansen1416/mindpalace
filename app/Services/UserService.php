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
use DB;

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


    public function createUser(array $data)
    {
        DB::beginTransaction();

        try {

            $userData = [
                'email'    => $data['email'],
                'password' => bcrypt($data['password']),
            ];

            $user = $this->userRepo->createUser($userData);

            //save not complete
            if (!$user[0]) {
                return ['status' => 500, 'error' => 'unable to save user'];
            }

            $profileData = [
                'user_id' => $user[1]->user_id,
                'name'    => $data['name'],
            ];

            $profile = $this->profileRepo->createProfile($profileData);

            if (!$profile[0]) {
                return ['status' => 500, 'error' => 'unable to save profile'];
            }

            DB::commit();

            return $user[1];
        } catch (\Exception $e) {
            DB::rollBack();
            return ['status' => 500, 'error' => $e->getMessage()];
        }
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
            return ['status' => 500, 'error' => 'can\'t find user'];
        }

        $res = $this->profileRepo->updateUserProfile($user->profile->profile_id, $profile);

        if ($res[0]) {
            return $res[1];
        } else {
            return ['status' => 500, 'error' => 'save profile failed'];
        }
    }


}
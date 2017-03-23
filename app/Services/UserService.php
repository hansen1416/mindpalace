<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-10-27
 * Time: 上午11:13
 */

namespace App\Services;

use App\Exceptions\CantFindException;
use App\Exceptions\SaveFailedException;
use App\Services\Contract\UserServiceContract;
use App\Repositories\Contract\UserRepositoryContract;
use App\Repositories\Contract\ProfileRepositoryContract;
use Auth;
use DB;

class UserService extends BaseService implements UserServiceContract
{
    protected $userRepo;

    protected $profileRepo;

    public function __construct(
        UserRepositoryContract $userRepositoryContract,
        ProfileRepositoryContract $profileRepositoryContract
    )
    {
        parent::__construct();
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
                throw new SaveFailedException();
            }

            $profileData = [
                'user_id' => $user[1]->user_id,
                'name'    => $data['name'],
            ];

            $profile = $this->profileRepo->createProfile($profileData);

            if (!$profile[0]) {
                throw new SaveFailedException();
            }

            DB::commit();

            return $user[1];
        } catch (\Exception $e) {
            DB::rollBack();
            return ['status' => 500, 'error' => $e->getMessage()];
        }
    }

    /**
     * @return int
     */
    public function userId()
    {
        $user = Auth::guard('api')->user();
        return $user ? $user->user_id : 0;
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
        try {

            $user = Auth::guard('api')->user();

            if (!$user) {
                throw new CantFindException();
            }

            $res = $this->profileRepo->updateUserProfile($user->profile->profile_id, $profile);

            if ($res[0]) {
                return $res[1];
            } else {
                throw new SaveFailedException();
            }
        } catch (\Exception $e) {
            return ['status' => 500, $e->getMessage()];
        }
    }

    /**
     * @param string $name
     * @return array
     */
    public function search(string $name)
    {
        try {
            $user_id = Auth::guard('api')->user()->user_id;

            $data = $this->profileRepo->searchUserByName('%' . $name . '%', $user_id);

            if ($data === false) {
                throw new CantFindException();
            }

            foreach ($data as $key => $value) {
                $data[$key]['is_friend'] = 0;
                foreach ($value['friends'] as $k => $v) {
                    if ($v['user_id'] == $user_id) {
                        $data[$key]['is_friend'] = 1;
                    }
                }
                unset($data[$key]['friends']);
            }

            return $data;

        } catch (\Exception $e) {
            return ['status' => 500, $e->getMessage()];
        }
    }

}
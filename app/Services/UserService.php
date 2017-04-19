<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-10-27
 * Time: 上午11:13
 */

namespace App\Services;

use App\Repositories\Contract\UserRepositoryContract;
use App\Repositories\Contract\ProfileRepositoryContract;
use App\Profile;
use App\User;

class UserService extends BaseService
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

    /**
     * @param array $data
     * @return User
     */
    public function userServiceCreateUser(array $data): User
    {
        $userData = [
            'email'    => $data['email'],
            'password' => bcrypt($data['password']),
        ];

        $user = $this->userRepo->userRepositoryCreateUser($userData);

        $profileData = [
            'user_id' => $user->user_id,
            'name'    => $data['name'],
        ];

        $this->profileRepo->profileRepositoryCreateProfile($profileData);

        return $user;
    }

    /**
     * @return array
     */
    public function userServiceProfile(): array
    {
        return $this->userRepo->userRepositoryProfile($this->getUserId());
    }

    /**
     * @param array $profile
     * @return Profile
     */
    public function userServiceUpdateUserProfile(array $profile): Profile
    {
        $user = $this->getUser();

        return $this->profileRepo->userRepositoryUpdateUserProfile($user->profile->profile_id, $profile);
    }

    /**
     * @param string $name
     * @return array
     */
    public function userServiceSearch(string $name): array
    {
        $user_id = $this->getUserId();

        $data = $this->profileRepo->profileRepositorySearch('%' . $name . '%', $user_id);

        //if they are friends, then is_friend = 1
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
    }

}
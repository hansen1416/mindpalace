<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-10-27
 * Time: 上午11:13
 */

namespace App\Services\Contract;

use App\Profile;
use App\User;

interface UserServiceContract
{
    /**
     * @param array $data
     * @return User
     */
    public function userServiceCreateUser(array $data): User;

    /**
     * @return array
     */
    public function userServiceProfile(): array;

    /**
     * @param array $profile
     * @return Profile
     */
    public function userServiceUpdateUserProfile(array $profile): Profile;

    /**
     * @param string $name
     * @return array
     */
    public function userServiceSearch(string $name): array;


}
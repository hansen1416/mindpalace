<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-10-27
 * Time: 上午11:13
 */

namespace App\Services\Contract;


interface UserServiceContract
{
    /**
     * @param array $data
     * @return mixed
     */
    public function createUser(array $data);

    /**
     * @return mixed
     */
    public function userProfile();

    /**
     * @param array $profile
     * @return mixed
     */
    public function updateUserProfile(array $profile);

    /**
     * @param string $name
     * @return array
     */
    public function search(string $name);


}
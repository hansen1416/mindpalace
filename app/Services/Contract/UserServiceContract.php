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
     * @return int
     */
    public function userId();

    /**
     * @return mixed
     */
    public function userProfile();
}
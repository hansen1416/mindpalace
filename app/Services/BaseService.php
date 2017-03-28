<?php
/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 17-2-9
 * Time: 下午2:54
 */

namespace App\Services;

use App\Exceptions\UnauthenticatedException;
use App\User;
use Auth;

abstract class BaseService
{

    public function __construct()
    {
    }

    /**
     * @return int
     */
    protected function getUserId(): int
    {
        return $this->getUser()->user_id;
    }

    /**
     * @return User
     * @throws UnauthenticatedException
     */
    protected function getUser(): User
    {
        $user = Auth::guard('api')->user()
            ? Auth::guard('api')->user()
            : Auth::user();

        if (!$user) {
            throw new UnauthenticatedException();
        }

        return $user;
    }


}
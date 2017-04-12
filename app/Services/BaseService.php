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
     * @param bool $guest
     * @return int
     */
    protected function getUserId($guest = false): int
    {
        return (int)$this->getUser($guest)->user_id;
    }

    /**
     * @param bool $guest
     * @return User
     * @throws UnauthenticatedException
     */
    protected function getUser($guest = false): User
    {
        $user = Auth::guard('api')->user()
            ? Auth::guard('api')->user()
            : Auth::user();

        if (!$user) {

            if ($guest) {
                return new User();
            }

            throw new UnauthenticatedException();
        }

        return $user;
    }


}
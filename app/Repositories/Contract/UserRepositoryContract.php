<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-9-30
 * Time: 下午4:57
 */

namespace App\Repositories\Contract;

use Hansen1416\Repository\Contracts\CacheableContract;
use Hansen1416\Repository\Contracts\RepositoryContract;
use App\Exceptions\CantFindException;
use App\Exceptions\SaveFailedException;
use App\User;

interface UserRepositoryContract extends RepositoryContract, CacheableContract
{
    /**
     * @param array $attributes
     * @return User
     * @throws SaveFailedException
     */
    public function userRepositoryCreateUser(array $attributes): User;

    /**
     * @param int $user_id
     * @return array
     * @throws CantFindException
     */
    public function userRepositoryProfile(int $user_id): array;
}
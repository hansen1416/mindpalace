<?php
/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 17-2-21
 * Time: 下午10:54
 */

namespace App\Repositories\Contract;

use Hansen1416\Repository\Contracts\CacheableContract;
use Hansen1416\Repository\Contracts\RepositoryContract;
use App\Exceptions\CantFindException;
use App\Exceptions\SaveFailedException;
use App\Profile;

interface ProfileRepositoryContract extends CacheableContract, RepositoryContract
{
    /**
     * @param array $attributes
     * @return Profile
     * @throws SaveFailedException
     */
    public function profileRepositoryCreateProfile(array $attributes): Profile;

    /**
     * 更新用户详情
     * @param int   $profile_id
     * @param array $attributes
     * @return Profile
     * @throws SaveFailedException
     */
    public function userRepositoryUpdateUserProfile(int $profile_id, array $attributes): Profile;

    /**
     * @param string $name
     * @param int    $user_id
     * @return array
     * @throws CantFindException
     */
    public function profileRepositorySearch(string $name, int $user_id): array;
}
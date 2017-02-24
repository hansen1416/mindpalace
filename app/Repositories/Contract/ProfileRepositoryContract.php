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

interface ProfileRepositoryContract extends CacheableContract, RepositoryContract
{
    public function updateUserProfile(int $profile_id, array $attributes);
}
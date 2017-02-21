<?php
/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 17-2-21
 * Time: 下午10:54
 */

namespace App\Repositories\Contract;

use Rinvex\Repository\Contracts\CacheableContract;
use Rinvex\Repository\Contracts\RepositoryContract;

interface ProfileRepositoryContract extends CacheableContract, RepositoryContract
{
    public function updateUserProfile(int $profile_id, array $attributes);
}
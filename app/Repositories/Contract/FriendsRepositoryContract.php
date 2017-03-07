<?php
/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 17-3-1
 * Time: 下午1:57
 */

namespace App\Repositories\Contract;

use Hansen1416\Repository\Contracts\CacheableContract;
use Hansen1416\Repository\Contracts\RepositoryContract;

interface FriendsRepositoryContract extends CacheableContract, RepositoryContract
{
    /**
     * @param array $data
     * @return mixed
     */
    public function friendRepositoryCreate(array $data);
}
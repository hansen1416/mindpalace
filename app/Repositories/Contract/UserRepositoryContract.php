<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-9-30
 * Time: 下午4:57
 */

namespace App\Repositories\Contract;

use Rinvex\Repository\Contracts\CacheableContract;
use Rinvex\Repository\Contracts\RepositoryContract;

interface UserRepositoryContract extends RepositoryContract, CacheableContract
{
    /**
     * user profile
     * @param int $user_id
     * @return array
     */
    public function userProfile(int $user_id);

}
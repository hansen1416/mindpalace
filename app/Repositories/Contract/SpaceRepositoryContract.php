<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-10-27
 * Time: 下午5:06
 */

namespace App\Repositories\Contract;

use Rinvex\Repository\Contracts\CacheableContract;
use Rinvex\Repository\Contracts\RepositoryContract;


interface SpaceRepositoryContract extends CacheableContract, RepositoryContract
{
    /**
     * user spaces
     * @param int $user_id
     * @return array
     */
    public function allSpace(int $user_id);

    /**
     * @param string $name
     * @param int $user_id
     * @return array
     */
    public function searchUserSpaceByName(string $name, int $user_id);
}
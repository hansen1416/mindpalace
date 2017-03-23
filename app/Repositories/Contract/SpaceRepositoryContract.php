<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-10-27
 * Time: 下午5:06
 */

namespace App\Repositories\Contract;

use Hansen1416\Repository\Contracts\CacheableContract;
use Hansen1416\Repository\Contracts\RepositoryContract;


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

    /**
     * @param array $data
     * @return \App\Space
     */
    public function spaceRepositoryCreate(array $data);
}
<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 17-1-11
 * Time: 上午9:28
 */

namespace App\Repositories\Contract;

use Rinvex\Repository\Contracts\CacheableContract;
use Rinvex\Repository\Contracts\RepositoryContract;

interface SpaceCtgRepositoryContract extends CacheableContract, RepositoryContract
{
    public function getCtgsBySpaceId(int $space_id);


    public function getCtgsByCtgId(int $space_id, int $ctg_id);
}
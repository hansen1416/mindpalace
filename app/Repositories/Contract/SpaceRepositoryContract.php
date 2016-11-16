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
     * @return array
     */
    public function allSpace();

}
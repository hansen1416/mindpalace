<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 17-1-11
 * Time: 上午9:28
 */

namespace App\Repositories\Contract;

use Hansen1416\Repository\Contracts\CacheableContract;
use Hansen1416\Repository\Contracts\RepositoryContract;

interface SpaceCtgRepositoryContract extends CacheableContract, RepositoryContract
{
    /**
     * @param int  $space_id
     * @param int  $ctg_id
     * @param bool $array
     * @return mixed
     */
    public function getOne(int $space_id, int $ctg_id, bool $array = true);

    /**
     * @param int $space_id
     * @return mixed
     */
    public function getCtgsBySpaceId(int $space_id);

    /**
     * @param int $space_id
     * @param int $ctg_id
     * @return mixed
     */
    public function getDescendantsByCtgId(int $space_id, int $ctg_id);

    /**
     * @param array $condition
     * @param array $attributes
     * @return mixed
     */
    public function massUpdate(array $condition, array $attributes);

    /**
     * @param array $data
     * @return \App\SpaceCtg
     * @throws \App\Exceptions\SaveFailedException
     */
    public function spaceCtgRepositoryCreate(array $data);
}
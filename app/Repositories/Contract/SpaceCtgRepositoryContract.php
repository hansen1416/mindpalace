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
use App\Exceptions\CantFindException;
use App\Exceptions\SaveFailedException;
use App\Exceptions\DeleteFailedException;
use App\SpaceCtg;

interface SpaceCtgRepositoryContract extends CacheableContract, RepositoryContract
{
    /**
     * @param int $space_id
     * @param int $ctg_id
     * @return SpaceCtg
     * @throws CantFindException
     */
    public function getOne(int $space_id, int $ctg_id): SpaceCtg;

    /**
     * get all ctg with same space_id
     * @param int $space_id
     * @return array
     * @throws CantFindException
     */
    public function spaceCtgRepositorySpaceCtg(int $space_id): array;

    /**
     * get the descendants of a given ctg_id
     * @param int $space_id
     * @param int $ctg_id
     * @return array
     * @throws CantFindException
     */
    public function spaceCtgRepositoryCtgDescendants(int $space_id, int $ctg_id): array;

    /**
     * @param array $condition
     * @param array $attributes
     * @return bool
     * @throws SaveFailedException
     */
    public function massUpdate(array $condition, array $attributes): bool;

    /**
     * @param array $data
     * @return SpaceCtg
     * @throws SaveFailedException
     */
    public function spaceCtgRepositoryCreate(array $data): SpaceCtg;

    /**
     * @param int $ctg_id
     * @param int $space_id
     * @return int
     * @throws DeleteFailedException
     */
    public function spaceCtgRepositoryDeleteCtg(int $space_id, int $ctg_id): int;

    /**
     * @param int $space_id
     * @return \Illuminate\Database\Eloquent\Model | SpaceCtg
     */
    public function spaceCtgRepositoryGetSpaceOriginCtg(int $space_id): SpaceCtg;

    /**
     * @param array $data
     * @return bool
     * @throws SaveFailedException
     */
    public function spaceCtgRepositoryMassInsert(array $data): bool;

}
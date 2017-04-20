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
use App\Exceptions\CantFindException;
use App\Exceptions\SaveFailedException;
use App\Space;

interface SpaceRepositoryContract extends CacheableContract, RepositoryContract
{
    /**
     * @param int $user_id
     * @return array
     * @throws CantFindException
     */
    public function spaceRepositoryHomeSpaces(int $user_id): array;

    /**
     * @param array $data
     * @return Space
     * @throws SaveFailedException
     */
    public function spaceRepositoryCreate(array $data): Space;

    /**
     * search only the user own space and public space
     * @param string $name
     * @param int    $user_id
     * @return array
     * @throws CantFindException
     */
    public function searchUserSpaceByName(string $name, int $user_id): array;

    /**
     * @param int $space_id
     * @return \Illuminate\Database\Eloquent\Model | Space
     * @throws CantFindException
     */
    public function getOne(int $space_id): Space;

}
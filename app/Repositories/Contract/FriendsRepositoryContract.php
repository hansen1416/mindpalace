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
use App\Friends;

interface FriendsRepositoryContract extends CacheableContract, RepositoryContract
{
    /**
     * @param array $data
     * @return Friends
     * @throws \App\Exceptions\SaveFailedException
     */
    public function friendRepositoryCreate(array $data): Friends;

    /**
     * @param int $user_id
     * @return array
     * @throws \App\Exceptions\CantFindException
     */
    public function friendRepositoryLists(int $user_id): array;

    /**
     * @param $user_id
     * @param $friend_id
     * @return int
     */
    public function friendRepositoryDelete($user_id, $friend_id): int;

}
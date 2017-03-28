<?php
/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 17-3-6
 * Time: 下午6:07
 */

namespace App\Services\Contract;

use App\Friends;

interface FriendsServiceContract
{
    /**
     * @param $friend_id
     * @return Friends
     */
    public function friendServiceCreate($friend_id): Friends;

    /**
     * @return array
     */
    public function friendServiceLists(): array;

}
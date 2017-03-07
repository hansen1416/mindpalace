<?php
/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 17-3-6
 * Time: 下午6:07
 */

namespace App\Services\Contract;


interface FriendsServiceContract
{
    /**
     * @param $friend_id
     * @return mixed
     */
    public function friendServiceCreate($friend_id);

    /**
     * @return mixed
     */
    public function friendServiceLists();
}
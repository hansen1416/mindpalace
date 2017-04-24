<?php
/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 17-3-6
 * Time: 下午6:08
 */

namespace App\Services;

use App\Repositories\Contract\FriendsRepositoryContract;
use App\Friends;

class FriendsService extends BaseService
{
    private $friendsRepo;


    public function __construct(
        FriendsRepositoryContract $friendsRepositoryContract
    )
    {
        parent::__construct();
        $this->friendsRepo = $friendsRepositoryContract;
    }

    /**
     * @param $friend_id
     * @return Friends
     */
    public function friendServiceCreate(int $friend_id): Friends
    {
        return $this->friendsRepo->friendRepositoryCreate([
                                                              'user_id'   => $this->getUserId(),
                                                              'friend_id' => $friend_id,
                                                          ]);
    }

    /**
     * @return array
     */
    public function friendServiceLists(): array
    {
        $data    = $this->friendsRepo->friendRepositoryLists($this->getUserId());
        $friends = [];

        foreach ($data as $key => $value) {
            $friends[$key]['user_id']   = $value['friend_id'];
            $friends[$key]['name']      = $value['profile']['name'];
            $friends[$key]['portrait']  = $value['profile']['portrait'];
            $friends[$key]['is_friend'] = 1;
        }

        return array_values($friends);
    }


    public function friendServiceDelete(int $friend_id)
    {
        return $this->friendsRepo->friendRepositoryDelete($this->getUserId(), $friend_id);
    }

}
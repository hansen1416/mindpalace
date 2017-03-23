<?php
/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 17-3-6
 * Time: 下午6:08
 */

namespace App\Services;

use App\Exceptions\CantFindException;
use App\Exceptions\SaveFailedException;
use App\Services\Contract\FriendsServiceContract;
use App\Repositories\Contract\FriendsRepositoryContract;
use Auth;

class FriendsService extends BaseService implements FriendsServiceContract
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
     * @return array
     */
    public function friendServiceCreate($friend_id)
    {
        try {
            $user_id = Auth::guard('api')->user()->user_id;

            $res = $this->friendsRepo->friendRepositoryCreate([
                                                                  'user_id'   => $user_id,
                                                                  'friend_id' => $friend_id,
                                                              ]);

            if ($res === false) {
                throw new SaveFailedException();
            }

            return ['message' => 'saved'];

        } catch (\Exception $e) {
            return ['status' => 500, 'error' => $e->getMessage()];
        }

    }


    public function friendServiceLists()
    {

        try {

            $user_id = Auth::guard('api')->user()->user_id;

            $data = $this->friendsRepo->friendRepositoryLists($user_id);

            if ($data === false) {
                throw new CantFindException();
            }

            $friends = [];

            foreach ($data as $key => $value) {
                $friends[$key]['user_id']   = $value['friend_id'];
                $friends[$key]['name']      = $value['profile']['name'];
                $friends[$key]['portrait']  = $value['profile']['portrait'];
                $friends[$key]['is_friend'] = 1;
            }

            return array_values($friends);

        } catch (\Exception $e) {
            return ['status' => 500, 'error' => $e->getMessage()];
        }
    }


}
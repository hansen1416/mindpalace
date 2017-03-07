<?php
/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 17-3-6
 * Time: 下午6:08
 */

namespace App\Services;

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
}
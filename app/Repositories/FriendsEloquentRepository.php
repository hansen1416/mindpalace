<?php
/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 17-3-1
 * Time: 下午2:09
 */

namespace App\Repositories;

use App\Exceptions\CantFindException;
use App\Exceptions\SaveFailedException;
use Hansen1416\Repository\Repositories\EloquentRepository;
use App\Repositories\Contract\FriendsRepositoryContract;
use App\Friends;

class FriendsEloquentRepository extends EloquentRepository implements FriendsRepositoryContract
{
    protected $repositoryId = 'rinvex.repository.friends';

    protected $model = 'App\Friends';

    /**
     * @param array $data
     * @return Friends
     * @throws \App\Exceptions\SaveFailedException
     */
    public function friendRepositoryCreate(array $data): Friends
    {
        $res = $this->create($data);

        if (!$res[0]) {
            throw new SaveFailedException();
        }

        return $res[1];
    }

    /**
     * @param int $user_id
     * @return array
     * @throws \App\Exceptions\CantFindException
     */
    public function friendRepositoryLists(int $user_id): array
    {
        $res = $this
            ->where('user_id', $user_id)
            ->with(['profile'])
            ->findAll();

        if (!$res) {
            throw new CantFindException();
        }

        return $res->toArray();
    }


}
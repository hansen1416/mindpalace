<?php
/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 17-3-1
 * Time: 下午2:09
 */

namespace App\Repositories;

use Hansen1416\Repository\Repositories\EloquentRepository;
use App\Repositories\Contract\FriendsRepositoryContract;

class FriendsEloquentRepository extends EloquentRepository implements FriendsRepositoryContract
{
    protected $repositoryId = 'rinvex.repository.friends';


    protected $model = 'App\Friends';

    /**
     * @param array $data
     * @return array
     */
    public function friendRepositoryCreate(array $data)
    {
        return $this->create($data);
    }

}
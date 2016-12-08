<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-10-27
 * Time: 下午5:07
 */

namespace App\Repositories;

use Rinvex\Repository\Repositories\EloquentRepository;
use App\Repositories\Contract\SpaceRepositoryContract;

class SpaceEloquentRepository extends EloquentRepository implements SpaceRepositoryContract
{
    protected $repositoryId = 'rinvex.repository.space';

    protected $model = 'App\Space';

    public function allSpace()
    {
        return $this
            ->orderBy('sort', 'ASC')
            ->orderBy('space_id', 'DESC')
            ->findAll()
            ->toArray();
    }


    public function searchUserSpaceByName(string $name, int $user_id)
    {
        return $this
            ->where('name', 'like', '%' . $name . '%')
            ->where('user_id', '=', 1, 'and')
            ->where(function($q){
                $q->where('user_id', '<>', 1, 'or');
                $q->where('share', '<>', 1, 'or');
            })
            ->orderBy('sort', 'DESC')
            ->orderBy('space_id', 'DESC')
            ->findAll()->toArray();
    }


}
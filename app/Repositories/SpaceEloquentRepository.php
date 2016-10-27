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

    public function allSpace(int $user_id)
    {

    }
}
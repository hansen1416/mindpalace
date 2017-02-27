<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-9-30
 * Time: 下午4:56
 */

namespace App\Repositories;

use Hansen1416\Repository\Repositories\EloquentRepository;
use App\Repositories\Contract\UserRepositoryContract;

class UserEloquentRepository extends EloquentRepository implements UserRepositoryContract
{
    protected $repositoryId = 'rinvex.repository.user';

    protected $model = 'App\User';

    public function userProfile(int $user_id)
    {
        return $this->with(['profile'])->find($user_id)->toArray();
    }


    public function createUser(array $attributes)
    {
        return $this->create($attributes);
    }


}
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
use App\Exceptions\CantFindException;
use App\Exceptions\SaveFailedException;
use App\User;

class UserEloquentRepository extends EloquentRepository implements UserRepositoryContract
{
    protected $repositoryId = 'rinvex.repository.user';

    protected $model = 'App\User';

    /**
     * @param array $attributes
     * @return User
     * @throws SaveFailedException
     */
    public function userRepositoryCreateUser(array $attributes): User
    {
        $res = $this->create($attributes);

        if (!$res[0]) {
            throw new SaveFailedException();
        }

        return $res[1];
    }

    /**
     * @param int $user_id
     * @return array
     * @throws CantFindException
     */
    public function userRepositoryProfile(int $user_id): array
    {
        $res = $this->with(['profile'])
                    ->find($user_id);

        if (!$res) {
            throw new CantFindException();
        }

        return $res->toArray();
    }


}
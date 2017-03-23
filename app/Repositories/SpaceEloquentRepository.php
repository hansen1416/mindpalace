<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-10-27
 * Time: 下午5:07
 */

namespace App\Repositories;

use App\Exceptions\SaveFailedException;
use Hansen1416\Repository\Repositories\EloquentRepository;
use App\Repositories\Contract\SpaceRepositoryContract;

class SpaceEloquentRepository extends EloquentRepository implements SpaceRepositoryContract
{
    protected $repositoryId = 'rinvex.repository.space';

    protected $model = 'App\Space';

    /**
     * @param array $data
     * @return \App\Space
     * @throws \App\Exceptions\SaveFailedException
     */
    public function spaceRepositoryCreate(array $data)
    {
        $res = $this->create($data);

        if (!$res[0]) {
            throw new SaveFailedException();
        }

        return $res[1];
    }

    /**
     * @param $user_id
     * @return $this
     */
    private function availableSpaces($user_id)
    {
        if ($user_id) {

            $this->where(function ($q) use ($user_id) {
                $q->where(function ($q) use ($user_id) {
                    $q->where('user_id', '<>', $user_id);
                    $q->where('share', '=', 1);
                })->where('user_id', '=', $user_id, 'or');
            });
        } else {
            $this->where('share', '=', 1);
        }

        return $this->orderBy('sort', 'ASC')
                    ->orderBy('space_id', 'DESC');
    }

    /**
     * @param int $user_id
     * @return array
     */
    public function allSpace(int $user_id)
    {
        $model = $this->availableSpaces($user_id);

        return $model->findAll()->toArray();
    }

    /**
     * search only the user own space and public space
     * @param string $name
     * @param int    $user_id
     * @return array
     */
    public function searchUserSpaceByName(string $name, int $user_id)
    {
        $model = $this->availableSpaces($user_id);

        $model->setCacheLifetime(0)
              ->where('name', 'like', '%' . $name . '%');

        return $model->findAll()->toArray();
    }


}
<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-10-27
 * Time: 下午5:07
 */

namespace App\Repositories;

use Hansen1416\Repository\Repositories\EloquentRepository;
use App\Repositories\Contract\SpaceRepositoryContract;
use App\Exceptions\CantFindException;
use App\Exceptions\SaveFailedException;
use App\Exceptions\DeleteFailedException;
use App\Space;
use Illuminate\Database\Eloquent\Builder;

class SpaceEloquentRepository extends EloquentRepository implements SpaceRepositoryContract
{
    protected $repositoryId = 'rinvex.repository.space';

    protected $model = 'App\Space';

    /**
     * @param int $user_id
     * @return array
     * @throws CantFindException
     */
    public function spaceRepositoryHomeSpaces(int $user_id): array
    {
        $res = $this->availableSpaces($user_id)->findAll();

        if (!$res) {
            throw new CantFindException();
        }

        return $res->toArray();
    }

    /**
     * @param $user_id
     * @return SpaceEloquentRepository
     */
    private function availableSpaces($user_id): SpaceEloquentRepository
    {
        if ($user_id) {

            $this->where(function (Builder $q) use ($user_id) {
                $q->where(function (Builder $q) use ($user_id) {
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
     * @param array $data
     * @return Space
     * @throws SaveFailedException
     */
    public function spaceRepositoryCreate(array $data): Space
    {
        $res = $this->create($data);

        if (!$res[0]) {
            throw new SaveFailedException();
        }

        return $res[1];
    }

    /**
     * search only the user own space and public space
     * @param string $name
     * @param int    $user_id
     * @return array
     * @throws CantFindException
     */
    public function searchUserSpaceByName(string $name, int $user_id): array
    {
        $res = $this->availableSpaces($user_id)
                    ->where('name', 'like', '%' . $name . '%')
                    ->findAll();

        if (!$res) {
            throw new CantFindException();
        }

        return $res->toArray();
    }

    /**
     * @param int $space_id
     * @return \Illuminate\Database\Eloquent\Model | Space
     * @throws CantFindException
     */
    public function getOne(int $space_id): Space
    {
        $res = $this->find($space_id);

        if (!$res) {
            throw new CantFindException();
        }

        return $res;
    }

    /**
     * @param int $space_id
     * @return bool
     * @throws DeleteFailedException
     */
    public function deleteOne(int $space_id): bool
    {
        $res = $this->delete($space_id);

        if (!$res[0]) {
            throw new DeleteFailedException();
        }

        return (bool)$res;
    }

}
<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 17-1-11
 * Time: 上午9:30
 */

namespace App\Repositories;

use Hansen1416\Repository\Repositories\EloquentRepository;
use App\Repositories\Contract\SpaceCtgRepositoryContract;
use App\Exceptions\CantFindException;
use App\Exceptions\SaveFailedException;
use App\Exceptions\DeleteFailedException;
use App\SpaceCtg;
use Illuminate\Database\Eloquent\Builder;

class SpaceCtgEloquentRepository extends EloquentRepository implements SpaceCtgRepositoryContract
{
    protected $repositoryId = 'rinvex.repository.spaceCtg';

    protected $model = 'App\SpaceCtg';

    /**
     * @param int $space_id
     * @param int $ctg_id
     * @return \Illuminate\Database\Eloquent\Model | SpaceCtg
     * @throws CantFindException
     */
    public function getOne(int $space_id, int $ctg_id): SpaceCtg
    {
        $data = $this
            ->where('space_id', $space_id)
            ->findBy('ctg_id', $ctg_id);

        if (!$data) {
            throw new CantFindException();
        }

        return $data;
    }

    /**
     * get all ctg with same space_id
     * @param int $space_id
     * @return array
     * @throws CantFindException
     */
    public function spaceCtgRepositorySpaceCtg(int $space_id): array
    {
        $res = $this
            ->where('space_id', $space_id)
            ->with(['ctg'])
            ->findAll();

        if (!$res) {
            throw  new CantFindException();
        }

        return $res->toArray();
    }

    /**
     * get the descendants of a given ctg_id
     * @param int $space_id
     * @param int $ctg_id
     * @return array
     * @throws CantFindException
     */
    public function spaceCtgRepositoryCtgDescendants(int $space_id, int $ctg_id): array
    {
        $res = $this
            ->setCacheLifetime(0)
            ->where('space_id', $space_id)
            ->where(function (Builder $q) use ($ctg_id) {
                $q->where('path', 'LIKE', '%-' . $ctg_id . '-%')
                  ->orWhere('ctg_id', $ctg_id);
            })
            ->with(['ctg'])
            ->findAll();

        if (!$res) {
            throw  new CantFindException();
        }

        return $res->toArray();
    }

    /**
     * @param array $condition
     * @param array $attributes
     * @return bool
     * @throws SaveFailedException
     */
    public function massUpdate(array $condition, array $attributes): bool
    {
        /** @var \App\SpaceCtg $spaceCtg */
        $spaceCtg = new $this->model;

        foreach ($condition as $where) {
            list($attribute, $operator, $value, $boolean) = array_pad($where, 4, null);
            $spaceCtg = $spaceCtg->where($attribute, $operator, $value, $boolean ? $boolean : 'and');
        }

        $res = $spaceCtg->update($attributes);

        if ($res) {
            //if updated successfully, fire the event, it will bust the cache
            $this->forgetCache();
//            $this->getContainer('events')->fire($this->getRepositoryId() . '.entity.updated', [$this, $spaceCtg]);
        }

        if ($res === false) {
            throw new SaveFailedException();
        }

        return $res;
    }

    /**
     * @param array $data
     * @return SpaceCtg
     * @throws SaveFailedException
     */
    public function spaceCtgRepositoryCreate(array $data): SpaceCtg
    {
        $res = $this->create($data);

        if (!$res) {
            throw new SaveFailedException();
        }

        return $res[1];
    }

    /**
     * @param int $ctg_id
     * @return int
     * @throws DeleteFailedException
     */
    public function ctgRepositoryDeleteCtg(int $ctg_id):int
    {
        /** @var \App\SpaceCtg $spaceCtg */
        $spaceCtg = new $this->model;

        $res = $spaceCtg->where('ctg_id', $ctg_id)
                        ->orWhere('path', 'like', '%-' . $ctg_id . '-%')
                        ->delete();

        if (!$res) {
            throw new DeleteFailedException();
        }

        $this->forgetCache();
        return $res;
    }


}
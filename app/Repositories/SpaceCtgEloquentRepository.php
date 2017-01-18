<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 17-1-11
 * Time: 上午9:30
 */

namespace App\Repositories;

use Rinvex\Repository\Repositories\EloquentRepository;
use App\Repositories\Contract\SpaceCtgRepositoryContract;

class SpaceCtgEloquentRepository extends EloquentRepository implements SpaceCtgRepositoryContract
{
    protected $repositoryId = 'rinvex.repository.spaceCtg';


    protected $model = 'App\SpaceCtg';

    /**
     * get one space ctg
     * @param int  $space_id
     * @param int  $ctg_id
     * @param bool $array
     * @return array|\Illuminate\Database\Eloquent\Model
     */
    public function getOne(int $space_id, int $ctg_id, bool $array = true)
    {
        $data = $this
            ->where('space_id', $space_id)
            ->findBy('ctg_id', $ctg_id);

        return $array && $data ? $data->toArray() : $data;
    }

    /**
     * get all ctg with same space_id
     * @param int $space_id
     * @return array
     */
    public function getCtgsBySpaceId(int $space_id)
    {
        return $this
            ->where('space_id', $space_id)
            ->with(['ctg'])
            ->findAll()->toArray();
    }

    /**
     * get the descendants of a given ctg_id
     * @param int $space_id
     * @param int $ctg_id
     * @return array
     */
    public function getDescendantsByCtgId(int $space_id, int $ctg_id)
    {
        return $this
//            ->setCacheLifetime(0)
            ->where('space_id', $space_id)
            ->where(function ($q) use ($ctg_id) {
                $q->where('path', 'LIKE', '%-' . $ctg_id . '-%')
                  ->orWhere('ctg_id', $ctg_id);
            })
            ->with(['ctg'])
            ->findAll()->toArray();
    }

    /**
     * update table
     * @param array $condition
     * @param array $attributes
     * @return bool
     */
    public function massUpdate(array $condition, array $attributes)
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
            $this->getContainer('events')->fire($this->getRepositoryId() . '.entity.updated', [$this, $spaceCtg]);
        }

        return $res;
    }


}
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


    public function getOne(int $space_id, int $ctg_id, bool $array = true)
    {
        $data = $this
            ->where('space_id', $space_id)
            ->findBy('ctg_id', $ctg_id);

        return $array && $data ? $data->toArray() : $data;
    }


    public function getCtgsBySpaceId(int $space_id)
    {
        return $this
            ->setCacheLifetime(0)
            ->where('space_id', $space_id)
            ->with(['ctg'])
            ->findAll()->toArray();
    }


    public function getDescendantsByCtgId(int $space_id, int $ctg_id)
    {
        return $this
//            ->setCacheLifetime(0)
            ->where('space_id', $space_id)
            ->where('path', 'LIKE', '%-' . $ctg_id . '-%')
            ->with(['ctg'])
            ->findAll()->toArray();
    }


    public function massUpdate(array $condition, array $attributes)
    {
        /** @var \App\SpaceCtg $spaceCtg */
        $spaceCtg = new $this->model;

        foreach ($condition as $where) {
            list($attribute, $operator, $value, $boolean) = array_pad($where, 4, null);
            $spaceCtg = $spaceCtg->where($attribute, $operator, $value, $boolean ? $boolean : 'and');
        }

        return $spaceCtg->update($attributes);
    }


}
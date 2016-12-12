<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-9-29
 * Time: 下午6:00
 */

namespace App\Repositories;

use Rinvex\Repository\Repositories\EloquentRepository;
use App\Repositories\Contract\CtgRepositoryContract;

class CtgEloquentRepository extends EloquentRepository implements CtgRepositoryContract
{
    protected $repositoryId = 'rinvex.repository.ctg';


    protected $model = 'App\Ctg';


    public function getOne(int $ctg_id)
    {
        return $this
            ->find($ctg_id)->toArray();
    }


    public function getBySpace(int $space_id)
    {
        return $this
            ->where('space_id', $space_id)
            ->findAll()->toArray();
    }


    public function getByCtg(int $ctg_id)
    {
        return $this
            ->where('path', 'LIKE', '%-' . $ctg_id . '-%')
            ->findAll()->toArray();
    }

}
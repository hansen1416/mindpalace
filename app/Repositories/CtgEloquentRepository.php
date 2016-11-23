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
            ->setCacheLifetime(0)
            ->find($ctg_id)->toArray();
    }


    public function getBySpace(int $space_id)
    {
        return $this
            ->where('space_id', $space_id)
            ->orderBy('tier', 'ASC')
//            ->orderBy('sort', 'ASC')
            ->findAll()->toArray();
    }


}
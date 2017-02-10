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
        $res = $this->find($ctg_id);
        return $res ? $res->toArray() : [];
    }


    public function createCtg(array $data)
    {
        return $this->create($data);
    }

}
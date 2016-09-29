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


    public function getOne($id)
    {

        $this->setCacheDriver('file');
        $driver = $this->getCacheDriver();

//        return $driver;

        return $this->find($id);
    }


}
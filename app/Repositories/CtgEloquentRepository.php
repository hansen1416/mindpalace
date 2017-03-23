<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-9-29
 * Time: 下午6:00
 */

namespace App\Repositories;

use App\Exceptions\SaveFailedException;
use Hansen1416\Repository\Repositories\EloquentRepository;
use App\Repositories\Contract\CtgRepositoryContract;

class CtgEloquentRepository extends EloquentRepository implements CtgRepositoryContract
{
    protected $repositoryId = 'rinvex.repository.ctg';


    protected $model = 'App\Ctg';

    /**
     * @param int $ctg_id
     * @return array
     */
    public function getOne(int $ctg_id)
    {
        $res = $this->find($ctg_id);
        return $res ? $res->toArray() : [];
    }

    /**
     * @param array $data
     * @return \App\Ctg
     * @throws \App\Exceptions\SaveFailedException
     */
    public function ctgRepositoryCreate(array $data)
    {
        $res = $this->create($data);

        if (!$res[0]) {
            throw new SaveFailedException();
        }

        return $res[1];
    }

}
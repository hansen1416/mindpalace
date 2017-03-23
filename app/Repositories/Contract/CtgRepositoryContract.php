<?php

/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 16-9-29
 * Time: 下午11:04
 */
namespace App\Repositories\Contract;

use Hansen1416\Repository\Contracts\CacheableContract;
use Hansen1416\Repository\Contracts\RepositoryContract;

interface CtgRepositoryContract extends CacheableContract, RepositoryContract
{
    /**
     * @param int $ctg_id
     * @return mixed
     */
    public function getOne(int $ctg_id);

    /**
     * @param array $data
     * @return \App\Ctg
     * @throws \App\Exceptions\SaveFailedException
     */
    public function ctgRepositoryCreate(array $data);
}
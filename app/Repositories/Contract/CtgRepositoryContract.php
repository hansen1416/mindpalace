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
    public function getOne(int $ctg_id);

    public function createCtg(array $data);
}
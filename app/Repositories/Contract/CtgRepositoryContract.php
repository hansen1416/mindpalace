<?php

/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 16-9-29
 * Time: 下午11:04
 */
namespace App\Repositories\Contract;

use Rinvex\Repository\Contracts\CacheableContract;
use Rinvex\Repository\Contracts\RepositoryContract;

interface CtgRepositoryContract extends CacheableContract, RepositoryContract
{
    public function getOne(int $ctg_id);

    public function getOneWithSpace(int $ctg_id);
}
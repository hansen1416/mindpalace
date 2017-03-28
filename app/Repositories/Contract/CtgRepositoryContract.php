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
use App\Exceptions\SaveFailedException;
use App\Ctg;

interface CtgRepositoryContract extends CacheableContract, RepositoryContract
{
    /**
     * @param array $data
     * @return Ctg
     * @throws SaveFailedException
     */
    public function ctgRepositoryCreate(array $data): Ctg;
}
<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 17-2-6
 * Time: 下午4:20
 */

namespace App\Repositories\Contract;

use Hansen1416\Repository\Contracts\CacheableContract;
use Hansen1416\Repository\Contracts\RepositoryContract;

interface ItemRepositoryContract extends CacheableContract, RepositoryContract
{
    public function getOne(int $ctg_id, int $item_id = null);


    public function saveItem(int $ctg_id, string $content, int $item_id = null);
}
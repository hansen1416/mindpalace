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
use App\Item;

interface ItemRepositoryContract extends CacheableContract, RepositoryContract
{

    /**
     * @param int      $ctg_id
     * @param int|null $item_id
     * @return mixed
     * @throws \App\Exceptions\CantFindException
     */
    public function getOne(int $ctg_id, int $item_id = null): Item;

    /**
     * @param int    $ctg_id
     * @param string $content
     * @return \App\Item
     * @throws \App\Exceptions\SaveFailedException
     */
    public function itemRepositoryCreate(int $ctg_id, string $content): Item;

    /**
     * @param int    $item_id
     * @param string $content
     * @return \App\Item
     * @throws \App\Exceptions\SaveFailedException
     */
    public function itemRepositoryUpdate(int $item_id, string $content): Item;

}
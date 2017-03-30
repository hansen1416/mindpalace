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
use App\Exceptions\SaveFailedException;
use App\Item;

interface ItemRepositoryContract extends CacheableContract, RepositoryContract
{

    /**
     * @param int $ctg_id
     * @return \Illuminate\Database\Eloquent\Model | Item
     */
    public function getItemByCtgId(int $ctg_id): Item;

    /**
     * @param int $ctg_id
     * @return int
     */
    public function getItemIdByCtgId(int $ctg_id):int;

    /**
     * @param int    $ctg_id
     * @param string $content
     * @return Item
     * @throws SaveFailedException
     */
    public function itemRepositoryCreate(int $ctg_id, string $content): Item;

    /**
     * @param int    $item_id
     * @param string $content
     * @return Item
     * @throws SaveFailedException
     */
    public function itemRepositoryUpdate(int $item_id, string $content): Item;

}
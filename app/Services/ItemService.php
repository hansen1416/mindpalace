<?php
/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 17-4-21
 * Time: 下午12:03
 */

namespace App\Services;

use App\Repositories\Contract\ItemRepositoryContract;
use App\Item;

class ItemService extends BaseService
{
    protected $itemRepo;

    public function __construct(
        ItemRepositoryContract $itemRepositoryContract
    )
    {
        $this->itemRepo = $itemRepositoryContract;
    }


    /**
     * @param int $ctg_id
     * @return Item
     */
    public function itemServiceCtgContent(int $ctg_id): Item
    {
        return $this->itemRepo->getItemByCtgId($ctg_id);
    }

    /**
     * save ctg content to item table
     * @param int    $ctg_id
     * @param string $content
     * @return Item
     */
    public function itemServiceSaveCtgContent(int $ctg_id, string $content): Item
    {
        $item_id = $this->itemRepo->getItemIdByCtgId($ctg_id);

        if ($item_id) {
            return $this->itemRepo->itemRepositoryUpdate($item_id, $content);
        }

        return $this->itemRepo->itemRepositoryCreate($ctg_id, $content);
    }

}
<?php
namespace App\Repositories;

use App\Item;

/**
 * Class ItemRepository
 * @package App\Repositories
 */
class ItemRepository extends Repository
{
    /**
     * @var Item
     */
    protected $item;

    /**
     * ItemRepository constructor.
     * @param Item $item
     */
    public function __construct(Item $item)
    {
        parent::__construct();

        $this->item = $item;
    }

    /**
     * @param $item_id
     * @return mixed
     */
    public function findItem($item_id)
    {
        return $this->item->noContent()->find($item_id);
    }

    /**
     * @param $item_id
     * @return mixed
     */
    public function getItemWithContent($item_id)
    {
        $data = $this->item->find($item_id);

        $data->content = htmlspecialchars_decode($data->content);

        return $data;
    }

    /**
     * @param $ctg_id
     * @param $user_id
     * @param $sort
     * @param $title
     * @param $content
     * @return bool
     */
    public function createItem($ctg_id, $user_id, $sort, $title, $content)
    {
        $this->item->ctg_id  = $ctg_id;
        $this->item->user_id = $user_id;
        $this->item->sort    = $sort;
        $this->item->title   = $title;
        $this->item->content = $content;

        return $this->item->save();
    }

    /**
     * @param        $item_id
     * @param        $ctg_id
     * @param        $sort
     * @param string $title
     * @param string $content
     * @return bool
     */
    public function updateItem($item_id, $ctg_id, $sort, $title = '', $content = '')
    {

        $item = $this->findItem($item_id);

        $item->sort = $sort;

        if ($ctg_id) {
            $item->ctg_id = $ctg_id;
        }

        if ($title) {
            $item->title = $title;
        }

        if ($content) {
            $item->content = $content;
        }

        return $item->save();
    }
}
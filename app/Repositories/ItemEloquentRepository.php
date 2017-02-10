<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 17-2-6
 * Time: 下午4:19
 */

namespace App\Repositories;

use Rinvex\Repository\Repositories\EloquentRepository;
use App\Repositories\Contract\ItemRepositoryContract;

class ItemEloquentRepository extends EloquentRepository implements ItemRepositoryContract
{
    protected $repositoryId = 'rinvex.repository.item';


    protected $model = 'App\Item';


    public function getOne(int $ctg_id, int $item_id = null)
    {
        $item = $item_id
            ? $this->find($item_id)
            : $this->findBy('ctg_id', $ctg_id);

        return $item ? $item->content : '';
    }


    public function saveItem(int $ctg_id, string $content, int $item_id = null)
    {
        $data = [
            'ctg_id'  => $ctg_id,
            'content' => $content,
        ];

        return $item_id
            ? $this->update($item_id, $data)
            : $this->create($data);
    }


}
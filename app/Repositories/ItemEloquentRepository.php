<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 17-2-6
 * Time: 下午4:19
 */

namespace App\Repositories;

use Hansen1416\Repository\Repositories\EloquentRepository;
use App\Repositories\Contract\ItemRepositoryContract;
use App\Exceptions\CantFindException;
use App\Exceptions\SaveFailedException;
use App\Item;

class ItemEloquentRepository extends EloquentRepository implements ItemRepositoryContract
{
    protected $repositoryId = 'rinvex.repository.item';

    protected $model = 'App\Item';

    /**
     * @param int      $ctg_id
     * @param int|null $item_id
     * @return \Illuminate\Database\Eloquent\Model | Item
     * @throws CantFindException
     */
    public function getOne(int $ctg_id, int $item_id = null): Item
    {
        $item = $item_id
            ? $this->find($item_id)
            : $this->findBy('ctg_id', $ctg_id);

        if (!$item) {
            throw new CantFindException();
        }

        return $item;
    }

    /**
     * @param int    $ctg_id
     * @param string $content
     * @return Item
     * @throws SaveFailedException
     */
    public function itemRepositoryCreate(int $ctg_id, string $content): Item
    {
        $data = [
            'ctg_id'  => $ctg_id,
            'content' => $content,
        ];

        $res = $this->create($data);

        if (!$res[0]) {
            throw new SaveFailedException();
        }

        return $res[1];
    }

    /**
     * @param int    $item_id
     * @param string $content
     * @return Item
     * @throws SaveFailedException
     */
    public function itemRepositoryUpdate(int $item_id, string $content): Item
    {
        $data = [
            'content' => $content,
        ];

        $res = $this->update($item_id, $data);

        if (!$res[0]) {
            throw new SaveFailedException();
        }

        return $res[1];
    }


}
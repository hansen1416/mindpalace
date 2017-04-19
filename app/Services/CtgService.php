<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-11-18
 * Time: 下午5:49
 */

namespace App\Services;

use App\Exceptions\CantFindException;
use App\Exceptions\SaveFailedException;
use App\Repositories\Contract\CtgRepositoryContract;
use App\Repositories\Contract\SpaceCtgRepositoryContract;
use App\Repositories\Contract\ItemRepositoryContract;
use App\Item;
use App\SpaceCtg;
use DB;

class CtgService extends BaseService
{

    protected $userService;

    protected $ctgRepo;

    protected $spaceCtgRepo;

    protected $itemRepo;


    public function __construct(
        UserService $userService,
        CtgRepositoryContract $ctgRepositoryContract,
        SpaceCtgRepositoryContract $spaceCtgRepositoryContract,
        ItemRepositoryContract $itemRepositoryContract
    )
    {
        parent::__construct();
        $this->userService  = $userService;
        $this->ctgRepo      = $ctgRepositoryContract;
        $this->spaceCtgRepo = $spaceCtgRepositoryContract;
        $this->itemRepo     = $itemRepositoryContract;
    }

    /**
     * @param int $space_id
     * @return array
     */
    public function ctgServiceSpaceCtg(int $space_id): array
    {
        return $this->spaceCtgRepo->spaceCtgRepositorySpaceCtg($space_id);
    }

    /**
     * @param int $space_id
     * @param int $ctg_id
     * @return array
     */
    public function ctgServiceCtgDescendant(int $space_id, int $ctg_id): array
    {
        return $this->spaceCtgRepo->spaceCtgRepositoryCtgDescendants($space_id, $ctg_id);
    }

    /**
     * change the pid of a ctg and it's path, tier and all it's descendant's path tier
     * @param int $space_id
     * @param int $ctg_id
     * @param int $pid
     * @return array
     * @throws CantFindException
     */
    public function moveCtg(int $space_id, int $ctg_id, int $pid): array
    {
        $ctg = $this->spaceCtgRepo->getOne($space_id, $ctg_id);

        if ($pid) {

            $parent = $this->spaceCtgRepo->getOne($space_id, $pid);

            /**
             * 如果目标父级分类是自己的子类，
             * 那么就抛出错误
             */
            $pattern = '/\-' . $ctg->ctg_id . '\-/';
            if (preg_match($pattern, $parent->path)) {
                throw new CantFindException('parent_ctg_is_descendant');
            }

            $path = $parent->path . $pid . '-';
            $tier = $parent->tier + 1;

        } else {

            $path = '-0-';
            $tier = 0;
        }

        $oldPath = $ctg->path . $ctg->ctg_id . '-';
        //update the ctg
        $this->spaceCtgRepo->massUpdate(
            [
                ['space_id', $space_id],
                ['ctg_id', $ctg_id],
            ],
            [
                'pid'  => $pid,
                'path' => $path,
                'tier' => $tier,
            ]
        );

        //build the path for descendant ctg
        $newPath = $path . $ctg->ctg_id . '-';
        $a       = count(explode('-', $oldPath)) - 3;
        $b       = count(explode('-', $newPath)) - 3;

        $update['path'] = DB::raw("REPLACE(path, '" . $oldPath . "', '" . $newPath . "')");
        $update['tier'] = DB::raw("(tier-{$a}+{$b})");
        //update the descendant ctgs
        $this->spaceCtgRepo->massUpdate(
            [
                ['path', 'like', $oldPath . '%'],
            ],
            $update
        );

        return ['message' => 'move_ctg'];
    }

    /**
     * @param int $ctg_id
     * @return Item
     */
    public function ctgServiceCtgContent(int $ctg_id): Item
    {
        return $this->itemRepo->getItemByCtgId($ctg_id);
    }

    /**
     * save ctg content to item table
     * @param int    $ctg_id
     * @param string $content
     * @return Item
     */
    public function ctgServiceSaveCtgContent(int $ctg_id, string $content): Item
    {
        $item_id = $this->itemRepo->getItemIdByCtgId($ctg_id);

        if ($item_id) {
            return $this->itemRepo->itemRepositoryUpdate($item_id, $content);
        }

        return $this->itemRepo->itemRepositoryCreate($ctg_id, $content);
    }

    /**
     * create a ctg,
     * fetch the parent ctg first
     * insert it into ctg table, get the ctg_id thereafter
     * insert it into spaceCtg table, get pid, tier, path value from parent ctg
     * @param string $title
     * @param int    $pid
     * @param int    $space_id
     * @param null   $tier
     * @param null   $path
     * @return SpaceCtg
     * @throws CantFindException
     */
    public function ctgServiceCreate(string $title, int $pid, int $space_id, $tier = null, $path = null): SpaceCtg
    {
        if (is_null($tier) && is_null($path)) {

            $tier = 0;
            $path = '-0-';

            if ($pid) {
                $parent = $this->spaceCtgRepo->getOne($space_id, $pid);

                $tier = (int)$parent->tier + 1;
                $path = $parent->path . $pid . '-';
            }
        }

        $ctg = $this->ctgRepo->ctgRepositoryCreate([
                                                       'user_id' => $this->getUserId(),
                                                       'title'   => $title,
                                                   ]);

        return $this->spaceCtgRepo->spaceCtgRepositoryCreate([
                                                                 'ctg_id'   => $ctg->ctg_id,
                                                                 'space_id' => $space_id,
                                                                 'pid'      => $pid,
                                                                 'tier'     => $tier,
                                                                 'path'     => $path,
                                                             ]);
    }

    /**
     * @param int $ctg_id
     * @return array
     */
    public function ctgServiceDeleteCtg(int $ctg_id): array
    {
        return [
            'deleted' => $this->spaceCtgRepo->spaceCtgRepositoryDeleteCtg($ctg_id),
        ];
    }


    public function ctgServiceCopyCtg(int $origin_space, int $ctg_id, int $space_id)
    {
        if ($origin_space == $space_id) {
            throw new SaveFailedException('can not copy ctg to its own space');
        }

        $insert = $this->spaceCtgRepo->spaceCtgRepositoryCtgDescendants($origin_space, $ctg_id);

        if (!$insert) {
            throw new CantFindException();
        }

        $new_space_origin = $this->spaceCtgRepo->getOne(166, 481);

        $ctg = $this->spaceCtgRepo->getOne($origin_space, $ctg_id);

        foreach ($insert as $key => &$value) {
            if ($value['ctg_id'] == $ctg_id) {
                $value['path'] = $new_space_origin->path . $new_space_origin->ctg_id . '-';
            } else {
                $value['path'] = str_replace(
                    $ctg->path,
                    $new_space_origin->path . $new_space_origin->ctg_id . '-',
                    $value['path']
                );
            }

            $value['space_id'] = $space_id;
            unset($value['ctg']);
        }

        return $insert;

    }

}
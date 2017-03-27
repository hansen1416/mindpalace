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
use App\Services\Contract\CtgServiceContract;
use App\Services\Contract\UserServiceContract;
use App\Repositories\Contract\CtgRepositoryContract;
use App\Repositories\Contract\SpaceCtgRepositoryContract;
use App\Repositories\Contract\ItemRepositoryContract;
use App\Item;
use DB;

class CtgService extends BaseService implements CtgServiceContract
{

    protected $userService;

    protected $ctgRepo;

    protected $spaceCtgRepo;

    protected $itemRepo;


    public function __construct(
        UserServiceContract $userServiceContract,
        CtgRepositoryContract $ctgRepositoryContract,
        SpaceCtgRepositoryContract $spaceCtgRepositoryContract,
        ItemRepositoryContract $itemRepositoryContract
    )
    {
        parent::__construct();
        $this->userService  = $userServiceContract;
        $this->ctgRepo      = $ctgRepositoryContract;
        $this->spaceCtgRepo = $spaceCtgRepositoryContract;
        $this->itemRepo     = $itemRepositoryContract;
    }


    public function spaceCtg(int $space_id)
    {
        return $this->spaceCtgRepo->getCtgsBySpaceId($space_id);
    }


    public function ctgDescendant(int $space_id, int $ctg_id)
    {
        return $this->spaceCtgRepo->getDescendantsByCtgId($space_id, $ctg_id);
    }

    /**
     * change the pid of a ctg and it's path, tier and all it's descendant's path tier
     * @param int $space_id
     * @param int $ctg_id
     * @param int $pid
     * @return array
     */
    public function moveCtg(int $space_id, int $ctg_id, int $pid)
    {
        DB::beginTransaction();

        try {

            $ctg = $this->spaceCtgRepo->getOne($space_id, $ctg_id);

            if ($pid) {

                $parent = $this->spaceCtgRepo->getOne($space_id, $pid);

                /**
                 * 如果目标父级分类是自己的子类，
                 * 那么就抛出错误
                 */
                $pattern = '/\-' . $ctg['ctg_id'] . '\-/';
                if (preg_match($pattern, $parent['path'])) {
                    return ['result' => false, 'error' => 'invalid pid'];
                }

                $path = $parent['path'] . $pid . '-';
                $tier = $parent['tier'] + 1;

            } else {

                $path = '-0-';
                $tier = 0;
            }

            $oldPath = $ctg['path'] . $ctg['ctg_id'] . '-';
            //update the ctg
            $res = $this->spaceCtgRepo->massUpdate(
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


            if (!$res) {
                throw new SaveFailedException();
            }

            $newPath = $path . $ctg['ctg_id'] . '-';
            $a       = count(explode('-', $oldPath)) - 3;
            $b       = count(explode('-', $newPath)) - 3;

            $update['path'] = DB::raw("REPLACE(path, '" . $oldPath . "', '" . $newPath . "')");
            $update['tier'] = DB::raw("(tier-{$a}+{$b})");
            //update the descendant ctgs
            $res = $this->spaceCtgRepo->massUpdate(
                [
                    ['path', 'like', $oldPath . '%'],
                ],
                $update
            );

            if ($res === false) {
                throw new SaveFailedException();
            }

            DB::commit();

            return ['message' => 'saved'];
        } catch (\Exception $e) {
            DB::rollBack();
            return ['status' => 500, 'error' => $e->getMessage()];
        }
    }

    /**
     * @param int $ctg_id
     * @return Item
     */
    public function ctgServiceCtgContent(int $ctg_id): Item
    {
        return $this->itemRepo->getOne($ctg_id);
    }

    /**
     * save ctg content to item table
     * @param int      $ctg_id
     * @param string   $content
     * @param int|null $item_id
     * @return mixed
     */
    public function ctgServiceSaveCtgContent(int $ctg_id, string $content): Item
    {
        $item = $this->itemRepo->getOne($ctg_id);

        if ($item->item_id) {
            return $this->itemRepo->itemRepositoryUpdate($item->item_id, $content);
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
     * @return \App\SpaceCtg | array
     */
    public function ctgServiceCreate(string $title, int $pid, int $space_id)
    {
        try {
            DB::beginTransaction();

            $spaceCtg = $this->ctgServiceCreateNestable($title, $pid, $space_id);
            DB::commit();
            return $spaceCtg;

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->returnException($e);
        }

    }

    /**
     * @param string $title
     * @param int    $pid
     * @param int    $space_id
     * @param        $tier
     * @param        $path
     * @return \App\SpaceCtg
     * @throws \App\Exceptions\CantFindException
     */
    public function ctgServiceCreateNestable(string $title, int $pid, int $space_id, $tier = null, $path = null)
    {
        if (is_null($tier) && is_null($path)) {

            $tier = 0;
            $path = '-0-';

            if ($pid) {
                $parent = $this->spaceCtgRepo->getOne($space_id, $pid, false);

                if (!$parent) {
                    throw new CantFindException();
                }

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


}
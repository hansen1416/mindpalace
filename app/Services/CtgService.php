<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-11-18
 * Time: 下午5:49
 */

namespace App\Services;

use App\Services\Contract\CtgServiceContract;
use App\Repositories\Contract\CtgRepositoryContract;
use App\Repositories\Contract\SpaceCtgRepositoryContract;
use App\Repositories\Contract\ItemRepositoryContract;
use DB;

class CtgService implements CtgServiceContract
{

    protected $ctgRepo;


    protected $spaceCtgRepo;


    protected $itemRepo;


    public function __construct(
        CtgRepositoryContract $ctgRepositoryContract,
        SpaceCtgRepositoryContract $spaceCtgRepositoryContract,
        ItemRepositoryContract $itemRepositoryContract
    )
    {
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

            DB::commit();

            return ['result' => $res];
        } catch (\Exception $e) {
            DB::rollBack();
            return ['result' => false, 'error' => $e->getMessage()];
        }
    }


    public function ctgContent(int $ctg_id)
    {
        return $this->itemRepo->getOne($ctg_id);
    }

}
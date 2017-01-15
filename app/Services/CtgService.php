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
use DB;

class CtgService implements CtgServiceContract
{

    protected $ctgRepo;


    protected $spaceCtgRepo;


    public function __construct(
        CtgRepositoryContract $ctgRepositoryContract,
        SpaceCtgRepositoryContract $spaceCtgRepositoryContract
    )
    {
        $this->ctgRepo      = $ctgRepositoryContract;
        $this->spaceCtgRepo = $spaceCtgRepositoryContract;
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
                    return ['status' => 0, 'message' => trans('errors.invalid_ctg_pid')];
                }


                $path = $parent['path'] . $pid . '-';
                $tier = $parent['tier'] + 1;

            } else {

                $path = '-0-';
                $tier = 0;
            }

            $oldPath = $ctg['path'] . $ctg['ctg_id'] . '-';

            $ctgModel = new $this->spaceCtgRepo->getModel();


            $ctgModel->pid  = $pid;
            $ctgModel->path = $path;
            $ctgModel->tier = $tier;
            $ctgModel->save();

            $newPath = $ctg['path'] . $ctg['ctg_id'] . '-';
            $a       = count(explode('-', $oldPath)) - 3;
            $b       = count(explode('-', $newPath)) - 3;

            $update['path'] = DB::raw("REPLACE(path, '" . $oldPath . "', '" . $newPath . "')");
            $update['tier'] = DB::raw("(tier-{$a}+{$b})");

            /**
             * 如果 $private == 1
             * 那么把该分类的所有子类都置为私有分类
             * 如果 $private == 0
             * 那么不需要去改变他的所有子类
             */
//            if ($ctg->private) {
//                $update['private'] = $ctg->private;
//            }

            $ctgModel = new $this->spaceCtgRepo->getModel();

            $res = $ctgModel->where('path', 'like', $oldPath . '%')
                             ->update($update);

            DB::commit();

            return ($res !== false);
        } catch (\Exception $e) {
            DB::rollBack();
            return $e->getMessage();
        }
    }


}
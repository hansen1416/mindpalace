<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 17-1-11
 * Time: 上午9:30
 */

namespace App\Repositories;

use Rinvex\Repository\Repositories\EloquentRepository;
use App\Repositories\Contract\SpaceCtgRepositoryContract;

class SpaceCtgEloquentRepository extends EloquentRepository implements SpaceCtgRepositoryContract
{
    protected $repositoryId = 'rinvex.repository.spaceCtg';


    protected $model = 'App\SpaceCtg';


    public function getCtgsBySpaceId(int $space_id)
    {
        return $this
//            ->setCacheLifetime(0)
            ->where('space_id', $space_id)
            ->with(['ctg'])
            ->findAll()->toArray();
    }


    public function getCtgsByCtgId(int $space_id, int $ctg_id)
    {
        return $this
//            ->setCacheLifetime(0)
            ->where('space_id', $space_id)
            ->where('path', 'LIKE', '%-' . $ctg_id . '-%')
            ->with(['ctg'])
            ->findAll()->toArray();
    }


    public function moveCtg(int $ctg_id, int $pid)
    {
        DB::beginTransaction();

        try {

            $ctg = Ctg::find($ctg_id);

            if ($pid) {

                $parent = $this->findCtg($pid);

                /**
                 * 如果目标父级分类是自己的子类，
                 * 那么就抛出错误
                 */
                $pattern = '/\-' . $ctg->ctg_id . '\-/';
                if (preg_match($pattern, $parent->path)) {
                    return ['status' => 0, 'message' => trans('errors.invalid_ctg_pid')];
                }


                $path = $parent->path . $pid . '-';
                $tier = $parent->tier + 1;

            } else {

                $path = '-0-';
                $tier = 0;
            }

            $oldPath = $ctg->path . $ctg->ctg_id . '-';

            $ctg->pid  = $pid;
            $ctg->path = $path;
            $ctg->tier = $tier;
            $ctg->save();

            $newPath = $ctg->path . $ctg->ctg_id . '-';
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
            if ($ctg->private) {
                $update['private'] = $ctg->private;
            }

            $res = $this->ctg->where('path', 'like', $oldPath . '%')
                             ->update($update);

            DB::commit();

            return ($res !== false);
        } catch (\Exception $e) {
            DB::rollBack();
            return $e->getMessage();
        }
    }

}
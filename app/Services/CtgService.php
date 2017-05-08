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
use App\Repositories\Contract\SpaceRepositoryContract;
use App\SpaceCtg;
use DB;

class CtgService extends BaseService
{

    protected $spaceRepo;

    protected $ctgRepo;

    protected $spaceCtgRepo;


    public function __construct(
        CtgRepositoryContract $ctgRepositoryContract,
        SpaceCtgRepositoryContract $spaceCtgRepositoryContract,
        SpaceRepositoryContract $spaceRepositoryContract
    )
    {
        parent::__construct();
        $this->ctgRepo      = $ctgRepositoryContract;
        $this->spaceCtgRepo = $spaceCtgRepositoryContract;
        $this->spaceRepo    = $spaceRepositoryContract;
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
     * @param int    $space_id
     * @param int    $ctg_id
     * @param string $title
     * @return SpaceCtg
     */
    public function ctgServiceUpdateTitle(int $space_id, int $ctg_id, string $title): SpaceCtg
    {
        $this->ctgRepo->ctgRepositoryUpdate($ctg_id, ['title' => $title]);

        $spaceCtg = $this->spaceCtgRepo->getOne($space_id, $ctg_id);
        //if the ctg is the root ctg of the space, update space name
        if ($spaceCtg->pid == 0) {
            $this->spaceRepo->spaceRepositoryUpdate($space_id, ['name' => $title]);
        }

        return $spaceCtg;
    }

    /**
     * @param int $space_id
     * @param int $ctg_id
     * @return array
     */
    public function ctgServiceDeleteCtg(int $space_id, int $ctg_id): array
    {
        $spaceCtg = $this->spaceCtgRepo->getOne($space_id, $ctg_id);
        //pid == 0 means the ctg is the root ctg of the space
        //if so, delete the space as well
        if ($spaceCtg->pid == 0) {
            $this->spaceRepo->deleteOne($space_id);
        }

        return [
            'deleted' => $this->spaceCtgRepo->spaceCtgRepositoryDeleteCtg($space_id, $ctg_id),
        ];
    }

    /**
     * @param int $origin_space
     * @param int $ctg_id
     * @param int $space_id
     * @return bool
     * @throws CantFindException
     * @throws SaveFailedException
     */
    public function ctgServiceLinkCtg(int $origin_space, int $ctg_id, int $space_id): bool
    {
        if ($origin_space == $space_id) {
            throw new SaveFailedException('can not copy ctg to its own space');
        }

        $insert = $this->spaceCtgRepo->spaceCtgRepositoryCtgDescendants($origin_space, $ctg_id);

        if (!$insert) {
            throw new CantFindException();
        }

        $originCtg = $this->spaceCtgRepo->spaceCtgRepositoryGetSpaceOriginCtg($space_id);
        $ctg       = $this->spaceCtgRepo->getOne($origin_space, $ctg_id);

        foreach ($insert as $key => &$value) {
            if ($value['ctg_id'] == $ctg_id) {
                $value['pid']  = $originCtg->ctg_id;
                $value['tier'] = 1;
                $value['path'] = $originCtg->path . $originCtg->ctg_id . '-';
            } else {
                $value['tier'] = $value['tier'] - $ctg['tier'] + 1;
                $value['path'] = str_replace(
                    $ctg->path,
                    $originCtg->path . $originCtg->ctg_id . '-',
                    $value['path']
                );
            }

            $value['space_id'] = $space_id;
            unset($value['ctg']);
        }

        return $this->spaceCtgRepo->spaceCtgRepositoryMassInsert($insert);
    }

    /**
     * @param int $origin_space
     * @param int $ctg_id
     * @param int $space_id
     * @return int
     */
    public function ctgServiceMoveCtg(int $origin_space, int $ctg_id, int $space_id): int
    {
        $insert = $this->ctgServiceLinkCtg($origin_space, $ctg_id, $space_id);

        if ($insert) {
            return $this->spaceCtgRepo->spaceCtgRepositoryDeleteCtg($origin_space, $ctg_id);
        }

        return 0;
    }

}
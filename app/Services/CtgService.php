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
        return $this->spaceCtgRepo->getCtgsByCtgId($space_id, $ctg_id);
    }


}
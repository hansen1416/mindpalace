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


class CtgService implements CtgServiceContract
{

    protected $ctgRepo;

    public function __construct(
        CtgRepositoryContract $ctgRepositoryContract
    )
    {
        $this->ctgRepo = $ctgRepositoryContract;
    }

    public function spaceCtg(int $space_id)
    {
        return $this->ctgRepo->getBySpace($space_id);
    }


    public function ctgDescendant(int $ctg_id)
    {
        return $this->ctgRepo->getByCtg($ctg_id);
    }


}
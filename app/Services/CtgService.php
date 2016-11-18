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

    public function spaceCtg($space_id)
    {
        return $this->ctgRepo->where('space_id', '=', $space_id)->findAll();
    }
}
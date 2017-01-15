<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-11-18
 * Time: 下午5:48
 */

namespace App\Services\Contract;


interface CtgServiceContract
{
    public function spaceCtg(int $space_id);

    public function ctgDescendant(int $space_id, int $ctg_id);

    public function moveCtg(int $space_id, int $ctg_id, int $pid);
}
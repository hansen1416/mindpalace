<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-10-27
 * Time: 下午5:09
 */

namespace App\Services\Contract;


interface SpaceServiceContract
{
    public function allSpace();


    public function updateSpace($space_id);
}
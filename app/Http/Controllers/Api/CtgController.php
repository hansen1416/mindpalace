<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-10-10
 * Time: 下午2:43
 */

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Contract\CtgServiceContract;

class CtgController extends Controller
{
    private $ctg;


    public function __construct(
        CtgServiceContract $ctgServiceContract
    )
    {
        $this->ctg = $ctgServiceContract;
    }


    public function spaceCtg($space_id)
    {
        return response()->json($this->ctg->spaceCtg($space_id));
    }


    public function ctgDescendant($space_id, $ctg_id)
    {
        return response()->json($this->ctg->ctgDescendant($space_id, $ctg_id));
    }


    public function moveCtg($space_id, $ctg_id, $pid)
    {
        $this->ctg->moveCtg($space_id, $ctg_id, $pid);
    }


}
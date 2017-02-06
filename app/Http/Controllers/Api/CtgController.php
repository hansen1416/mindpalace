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
use Illuminate\Http\Request;

class CtgController extends Controller
{
    private $ctg;


    public function __construct(
        CtgServiceContract $ctgServiceContract
    )
    {
        $this->ctg = $ctgServiceContract;
    }


    public function spaceCtg($space_id, $ctg_id = null)
    {
        return $ctg_id
            ? response()->json($this->ctg->ctgDescendant($space_id, $ctg_id))
            : response()->json($this->ctg->spaceCtg($space_id));
    }


    public function moveCtg($space_id, $ctg_id, $pid)
    {
        return response()->json($this->ctg->moveCtg($space_id, $ctg_id, $pid));
    }


    public function ctgContent($ctg_id)
    {
        return response()->json($this->ctg->ctgContent($ctg_id));
    }


    public function saveCtgContent(Request $request)
    {
        $ctg_id  = $request->input('ctg_id');
        $item_id = $request->input('item_id');
        $content = $request->input('content');

        return response()->json($this->ctg->saveCtgContent($ctg_id, $content, $item_id));
    }

}
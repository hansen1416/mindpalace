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
use Illuminate\Http\JsonResponse;

class CtgController extends Controller
{
    private $ctg;


    public function __construct(
        CtgServiceContract $ctgServiceContract
    )
    {
        $this->ctg = $ctgServiceContract;
    }


    public function spaceCtg($space_id, $ctg_id = null): JsonResponse
    {
        return $ctg_id
            ? $this->responseJson($this->ctg->ctgDescendant($space_id, $ctg_id))
            : $this->responseJson($this->ctg->spaceCtg($space_id));
    }

    /**
     * @param $space_id
     * @param $ctg_id
     * @param $pid
     * @return JsonResponse
     */
    public function moveCtg($space_id, $ctg_id, $pid): JsonResponse
    {
        return $this->responseJson($this->ctg->moveCtg($space_id, $ctg_id, $pid));
    }

    /**
     * @param $ctg_id
     * @return JsonResponse
     */
    public function ctgContent($ctg_id): JsonResponse
    {
        try {
            return $this->responseJson($this->ctg->ctgServiceCtgContent($ctg_id));
        } catch (\Exception $e) {
            return $this->responseJson($e);
        }
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function saveCtgContent(Request $request): JsonResponse
    {
        try {
            $ctg_id  = $request->input('ctg_id');
            $content = $request->input('content');

            return $this->responseJson($this->ctg->ctgServiceSaveCtgContent($ctg_id, $content));
        } catch (\Exception $e) {
            return $this->responseJson($e);
        }
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function createCtg(Request $request): JsonResponse
    {
        //ctg_id space_id title
        $pid      = (int)$request->input('ctg_id');
        $space_id = (int)$request->input('space_id');
        $title    = $request->input('title');

        return $this->responseJson($this->ctg->ctgServiceCreate($title, $pid, $space_id));
    }

}
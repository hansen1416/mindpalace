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
use DB;

class CtgController extends Controller
{
    private $ctg;

    public function __construct(
        CtgServiceContract $ctgServiceContract
    )
    {
        $this->ctg = $ctgServiceContract;
    }

    /**
     * @param      $space_id
     * @param null $ctg_id
     * @return JsonResponse
     */
    public function spaceCtg(int $space_id, $ctg_id = null): JsonResponse
    {
        try {
            return $ctg_id
                ? $this->responseJson($this->ctg->ctgServiceCtgDescendant($space_id, $ctg_id))
                : $this->responseJson($this->ctg->ctgServiceSpaceCtg($space_id));
        } catch (\Exception $e) {
            return $this->responseJson($e);
        }
    }

    /**
     * @param $space_id
     * @param $ctg_id
     * @param $pid
     * @return JsonResponse
     */
    public function moveCtg($space_id, $ctg_id, $pid): JsonResponse
    {
        try {
            DB::beginTransaction();
            $res = $this->responseJson($this->ctg->moveCtg($space_id, $ctg_id, $pid));

            DB::commit();
            return $this->responseJson($res);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->responseJson($e);
        }
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
        try {
            //ctg_id space_id title
            $pid      = (int)$request->input('ctg_id');
            $space_id = (int)$request->input('space_id');
            $title    = $request->input('title');

            DB::beginTransaction();
            $spaceCtg = $this->responseJson($this->ctg->ctgServiceCreate($title, $pid, $space_id));

            DB::commit();
            return $this->responseJson($spaceCtg);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->responseJson($e);
        }
    }

}
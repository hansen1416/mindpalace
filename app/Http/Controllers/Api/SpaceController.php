<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-10-27
 * Time: 下午5:46
 */

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SpaceService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SpaceController extends Controller
{
    private $space;

    public function __construct(
        SpaceService $spaceService
    )
    {
        $this->space = $spaceService;
    }

    /**
     * @return JsonResponse
     */
    public function home(): JsonResponse
    {
        try {

            return $this->responseJson(
                $this->space->spaceServiceHomeSpaces()
            );
        } catch (\Exception $e) {
            return $this->responseJson($e);
        }
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function search(Request $request): JsonResponse
    {
        try {

            return $this->responseJson(
                $this->space->searchSpace($request->input('name', ''))
            );
        } catch (\Exception $e) {
            return $this->responseJson($e);
        }
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function create(Request $request): JsonResponse
    {
        try {

            return $this->responseJson(
                $this->space->spaceServiceCreate($request->input('name'))
            );
        } catch (\Exception $e) {
            return $this->responseJson($e);
        }
    }

    /**
     * @param $space_id
     * @return JsonResponse
     */
    public function space($space_id): JsonResponse
    {
        try {

            return $this->responseJson(
                $this->space->spaceServiceGetOne($space_id)
            );
        } catch (\Exception $e) {
            return $this->responseJson($e);
        }
    }


}
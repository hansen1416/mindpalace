<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-10-27
 * Time: 下午5:46
 */

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Contract\SpaceServiceContract;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SpaceController extends Controller
{
    private $space;

    public function __construct(
        SpaceServiceContract $spaceServiceContract
    )
    {
        $this->space = $spaceServiceContract;
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


}
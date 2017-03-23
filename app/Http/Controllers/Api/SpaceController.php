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
     * @return \Illuminate\Http\JsonResponse
     */
    public function home()
    {
        return $this->responseJson(
            $this->space->allSpace()
        );
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function search(Request $request)
    {
        return $this->responseJson(
            $this->space->searchSpace($request->input('name', ''))
        );
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request)
    {
        return $this->responseJson(
            $this->space->spaceServiceCreate($request->input('name'))
        );
    }


}
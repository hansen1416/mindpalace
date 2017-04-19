<?php
/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 17-3-6
 * Time: 下午6:06
 */

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\FriendsService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FriendsController extends Controller
{
    private $friends;

    public function __construct(
        FriendsService $friendsService
    )
    {
        $this->friends = $friendsService;
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function create(Request $request): JsonResponse
    {
        try {
            $friend_id = $request->input('friend_id');

            return $this->responseJson(
                $this->friends->friendServiceCreate($friend_id)
            );
        } catch (\Exception $e) {
            return $this->responseJson($e);
        }
    }

    /**
     * @return JsonResponse
     */
    public function lists(): JsonResponse
    {
        try {
            return $this->responseJson(
                $this->friends->friendServiceLists()
            );
        } catch (\Exception $e) {
            return $this->responseJson($e);
        }
    }

}
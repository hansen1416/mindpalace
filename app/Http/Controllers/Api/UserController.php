<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-10-27
 * Time: 上午10:43
 */

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\UserService;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{

    public $user;

    public $img;

    public function __construct(
        UserService $userService,
        ImageService $imageService
    )
    {
        $this->user = $userService;
        $this->img  = $imageService;
    }

    /**
     * @return JsonResponse
     */
    public function profile(): JsonResponse
    {
        try {

            return $this->responseJson(
                $this->user->userServiceProfile()
            );
        } catch (\Exception $e) {
            return $this->responseJson($e);
        }
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function updateUserProfile(Request $request): JsonResponse
    {
        try {
            $data = $request->all();

            if ($request->hasFile('portrait') && $request->file('portrait')->isValid()) {

                $path = $this->img->savePortrait($request->file('portrait'));

                $data['portrait'] = $path;
            }

            return $this->responseJson(
                $this->user->userServiceUpdateUserProfile($data)
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
                $this->user->userServiceSearch($request->input('name'))
            );
        } catch (\Exception $e) {
            return $this->responseJson($e);
        }
    }


}
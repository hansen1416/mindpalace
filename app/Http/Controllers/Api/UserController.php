<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-10-27
 * Time: 上午10:43
 */

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Contract\UserServiceContract;
use App\Services\Contract\ImageServiceContract;
use Illuminate\Http\Request;

class UserController extends Controller
{

    public $user;

    public $img;

    public function __construct(
        UserServiceContract $userServiceContract,
        ImageServiceContract $imageServiceContract
    )
    {
        $this->user = $userServiceContract;
        $this->img  = $imageServiceContract;
    }


    public function profile()
    {
        return response()->json($this->user->userProfile());
    }


    public function updateUserProfile(Request $request)
    {
        $data = $request->all();

        if ($request->hasFile('portrait') && $request->file('portrait')->isValid()) {

            $path = $this->img->savePortrait($request->file('portrait'));

            if (isset($path['status']) && $path['status'] == 500) {
                return $this->responseJson($path);
            }

            $data['portrait'] = $path;
        }

        return $this->responseJson($this->user->updateUserProfile($data));
    }


}
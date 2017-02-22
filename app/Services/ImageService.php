<?php
/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 17-2-22
 * Time: 下午2:30
 */

namespace App\Services;

use App\Services\Contract\ImageServiceContract;
use App\Services\Contract\UserServiceContract;
use Intervention\Image\Facades\Image;
use Auth;

class ImageService extends BaseService implements ImageServiceContract
{
    protected $user;

    public function __construct(
        UserServiceContract $userServiceContract
    )
    {
        $this->user = $userServiceContract;
    }

    public function savePortrait($file)
    {
        try {
            $user_id = $this->user->userId();

            if (!$user_id) {
                return 401;
            }

            $img = Image::make($file);

            $path = storage_path();

            $name = 'portrait/' . $user_id . '.jpg';

            $img->resize(300, 300, function ($constraint) {
                $constraint->upsize();
            })->save($path . $user_id . '.jpg', 100);

            return env('API_URL') . $name;
        } catch (\Exception $e) {
            return 500;
        }

    }
}
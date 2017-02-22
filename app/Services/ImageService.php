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

    /**
     * 保存头像，原图 300x300
     * 缩略图 50x50
     * 图片名称是 用户ID
     * @param $file
     * @return int|string
     */
    public function savePortrait($file)
    {
        try {
            $user_id = $this->user->userId();

            if (!$user_id) {
                return 401;
            }

            $img = Image::make($file);

            $path = public_path();

            $name  = '/portrait/' . $user_id . '.jpg';
            $thumb = '/portrait/t-' . $user_id . '.jpg';

            $img->resize(300, 300, function ($constraint) {
                $constraint->upsize();
            })->save($path . $name, 100);

            $img->resize(50, 50, function ($constraint) {
                $constraint->upsize();
            })->save($path . $thumb, 100);

            return env('API_URL') . $name;
        } catch (\Exception $e) {
            return 500;
        }

    }
}
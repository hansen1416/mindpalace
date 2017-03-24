<?php
/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 17-2-22
 * Time: 下午2:30
 */

namespace App\Services;

use App\Services\Contract\ImageServiceContract;
use Intervention\Image\Facades\Image;

class ImageService extends BaseService implements ImageServiceContract
{

    public function __construct(
    )
    {
        parent::__construct();
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

            if (!$this->getUserId()) {
                return 401;
            }

            $img = Image::make($file);

            $path = public_path();

            $name  = '/portrait/' . $this->getUserId() . '.jpg';
            $thumb = '/portrait/' . $this->getUserId() . '-t.jpg';

            $img->resize(300, 300, function ($constraint) {
                $constraint->upsize();
            })->save($path . $name, 100);

            $img->resize(50, 50, function ($constraint) {
                $constraint->upsize();
            })->save($path . $thumb, 100);

            return env('API_URL') . $name;
        } catch (\Exception $e) {
            return ['status' => 500, 'error' => $e->getMessage()];
        }

    }
}
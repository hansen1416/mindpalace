<?php
/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 17-2-22
 * Time: 下午2:30
 */

namespace App\Services\Contract;

interface ImageServiceContract
{
    /**
     * 保存头像，原图 300x300
     * 缩略图 50x50
     * 图片名称是 用户ID
     * @param $file
     * @return string
     */
    public function savePortrait($file): string;
}
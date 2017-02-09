<?php
/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 17-2-9
 * Time: 下午2:54
 */

namespace App\Services;


abstract class BaseService
{
    protected function responseArray($status = 200, $message = '')
    {
        return [
            'status'  => $status,
            'message' => $message,
        ];
    }
}
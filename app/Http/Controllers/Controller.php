<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesResources;

class Controller extends BaseController
{
    use AuthorizesRequests, AuthorizesResources, DispatchesJobs, ValidatesRequests;

    /**
     * ajax请求的返回值
     * @param bool $status  成功/失败状态
     * @param string $message   信息
     */
    protected function ajaxReturn ($status = true, $message = '') {

        $status = $status ? 1 : 0;

        echo json_encode(['status' => $status, 'message' => $message]);
    }
}

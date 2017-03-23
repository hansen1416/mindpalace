<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * @param $data
     * @return \Illuminate\Http\JsonResponse
     */
    public function responseJson($data)
    {
        if (isset($data['status']) && $data['status'] == 500) {
            return response()->json($data);
        }

        return response()->json($data);
    }
}

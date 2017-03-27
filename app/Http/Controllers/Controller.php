<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use \Illuminate\Http\JsonResponse;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * @param $data
     * @return JsonResponse
     */
    public function responseJson($data): JsonResponse
    {
        if ($data instanceof \Exception) {
            return response()->json(['status' => 500, 'error' => $data->getMessage()]);
        }

        return response()->json($data);
    }


}

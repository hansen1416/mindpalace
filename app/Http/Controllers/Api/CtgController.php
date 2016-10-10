<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-10-10
 * Time: 下午2:43
 */

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

class CtgController extends Controller
{
    public function home()
    {
        header("Access-Control-Allow-Origin:*");
        header("Access-Control-Request-Method:POST, GET");
        header("Content-type");

        return 1111;

//        return response('2', 200, ['Access-Control-Allow-Origin' => '*', 'Access-Control-Request-Method' => 'POST, GET']);
    }
}
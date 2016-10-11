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
        return response()->json([
                                    'ctg',
                                ]);
    }
}
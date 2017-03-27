<?php
/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 17-2-9
 * Time: 下午2:54
 */

namespace App\Services;

use Illuminate\Database\Eloquent\Model;
use Auth;

abstract class BaseService
{

    public function __construct()
    {
    }

    /**
     * @param \Exception $e
     * @return array
     */
    protected function returnException(\Exception $e)
    {
        return ['status' => 500, 'error' => $e->getMessage()];
    }

    /**
     * @param Model $model
     * @return array
     */
    protected function returnModel(Model $model)
    {
        return $model->toArray();
    }


    public function getUserId()
    {
        $user_id = Auth::guard('api')->user() ? Auth::guard('api')->user()->user_id : 0;

        if (!$user_id) {
            $user_id = Auth::user() ? Auth::user()->user_id : 0;
        }

        return $user_id;
    }


}
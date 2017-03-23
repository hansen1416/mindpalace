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

    public $user_id;

    public function __construct()
    {
        $user = Auth::guard('api')->user();

        $this->user_id = $user ? $user->user_id : 0;
    }

    /**
     * @param \Exception $e
     * @return array
     */
    protected function returnException(\Exception $e)
    {
        return ['status' => 500, $e->getMessage()];
    }

    /**
     * @param Model $model
     * @return array
     */
    protected function returnModel(Model $model)
    {
        return $model->toArray();
    }
}
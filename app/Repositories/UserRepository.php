<?php
namespace App\Repositories;

use App\User;
use Auth;

/**
 * 用于从模型获取所有的用户相关信息
 * 可以统一管理查询语言
 * Class UserRepository
 * @package App\Repositories
 */
class UserRepository
{

    public function userInfo() {
        return Auth::user();
    }

}
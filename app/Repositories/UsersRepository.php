<?php
namespace App\Repositories;

use App\User;
use App\Profile;

/**
 * 用于从模型获取所有的用户相关信息
 * 可以统一管理查询语言
 * Class UsersRepository
 * @package App\Repositories
 */
class UsersRepository
{

    public function complete() {
        return 'here is user full info';
    }

}
<?php
namespace App\Repositories;

use Auth;
use App\User;
use App\theme;

/**
 * 用于从模型获取所有的用户相关信息
 * 可以统一管理查询语言
 * Class UserRepository
 * @package App\Repositories
 */
class UserRepository
{

    /**
     * @var User
     */
    protected $user;

    /**
     * @var theme
     */
    protected $theme;

    /**
     * UserRepository constructor.
     * @param User  $user
     * @param theme $theme
     */
    public function __construct(User $user, Theme $theme)
    {
        $this->user  = $user;
        $this->theme = $theme;
    }

    /**
     * @return User|null
     */
    public function userInfo()
    {
        return Auth::user();
    }

    /**
     * @return array
     */
    public function allThemes()
    {
        $data = $this->theme->allTheme()->get();
        $res  = [];

        foreach ($data as $value) {
            $res[$value->name] = route('changeTheme', ['theme_id' => $value->theme_id]);
        }

        return $res;
    }

}
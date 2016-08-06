<?php
namespace App\Repositories;

use Auth;
use App\User;
use App\Profile;
use App\Theme;

/**
 * 用于从模型获取所有的用户相关信息
 * 可以统一管理查询语言
 * Class UserRepository
 * @package App\Repositories
 */
class UserRepository extends Repository
{

    /**
     * @var User
     */
    protected $user;

    /**
     * @var Profile
     */
    protected $profile;

    /**
     * @var theme
     */
    protected $theme;

    /**
     * UserRepository constructor.
     * @param User    $user
     * @param Profile $profile
     * @param theme   $theme
     */
    public function __construct(User $user, Profile $profile, Theme $theme)
    {
        parent::__construct();

        $this->user    = $user;
        $this->profile = $profile;
        $this->theme   = $theme;
    }

    /**
     * @return User|null
     */
    public function userInfo()
    {
        return Auth::user();
    }

    /**
     * @return string
     */
    public function getDefaultTheme()
    {
        return $this->userInfo() ? $this->userInfo()->profile->theme->name : 'nebula';
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

    /**
     * @param $theme_id
     * @return bool|int
     */
    public function updateTheme($theme_id)
    {

        return $this->profile
            ->getProfileByUserId($this->userInfo()->user_id)
            ->update(['theme_id' => $theme_id]);
    }

}
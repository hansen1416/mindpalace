<?php
/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 17-2-21
 * Time: 下午10:52
 */

namespace App\Repositories;

use Hansen1416\Repository\Repositories\EloquentRepository;
use App\Repositories\Contract\ProfileRepositoryContract;
use App\Repositories\UserEloquentRepository;

class ProfileEloquentRepository extends EloquentRepository implements ProfileRepositoryContract
{
    protected $repositoryId = 'rinvex.repository.profile';

    protected $model = 'App\Profile';

    /**
     * 更新用户详情
     * @param int   $profile_id
     * @param array $attributes
     * @return array
     */
    public function updateUserProfile(int $profile_id, array $attributes)
    {
        //clear user repo cache, otherwise api won't get the latest data
        $userRepo = new UserEloquentRepository();
        $userRepo->forgetCache();

        return $this->update($profile_id, $attributes);
    }

    /**
     * @param array $attributes
     * @return array
     */
    public function createProfile(array $attributes)
    {
        return $this->create($attributes);
    }

    /**
     * @param string $name
     * @return array
     */
    public function searchUserByName(string $name, $user_id)
    {
        return $this
            ->where('name', 'like', $name)
            ->where('user_id', '<>', $user_id)
            ->with(['friends'])
            ->findAll(['user_id', 'name', 'portrait'])->toArray();
    }

}
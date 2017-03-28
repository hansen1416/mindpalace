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
use App\Repositories\Contract\UserRepositoryContract;
use App\Exceptions\CantFindException;
use App\Exceptions\SaveFailedException;
use App\Profile;

class ProfileEloquentRepository extends EloquentRepository implements ProfileRepositoryContract
{
    protected $repositoryId = 'rinvex.repository.profile';

    protected $model = 'App\Profile';

    private $userRepo;

    public function __construct(
        UserRepositoryContract $userRepositoryContract
    )
    {
        $this->userRepo = $userRepositoryContract;
    }

    /**
     * @param array $attributes
     * @return Profile
     * @throws SaveFailedException
     */
    public function profileRepositoryCreateProfile(array $attributes): Profile
    {
        $res = $this->create($attributes);

        if (!$res[0]) {
            throw new SaveFailedException();
        }

        return $res[1];
    }

    /**
     * 更新用户详情
     * @param int   $profile_id
     * @param array $attributes
     * @return Profile
     * @throws SaveFailedException
     */
    public function userRepositoryUpdateUserProfile(int $profile_id, array $attributes): Profile
    {
        //clear user repo cache, otherwise api won't get the latest data
        $this->userRepo->forgetCache();

        $res = $this->update($profile_id, $attributes);

        if (!$res[0]) {
            throw new SaveFailedException();
        }

        return $res[1];
    }

    /**
     * @param string $name
     * @param int    $user_id
     * @return array
     * @throws CantFindException
     */
    public function profileRepositorySearch(string $name, int $user_id): array
    {
        $res = $this
            ->where('name', 'like', $name)
            ->where('user_id', '<>', $user_id)
            ->with(['friends'])
            ->findAll(['user_id', 'name', 'portrait']);

        if (!$res) {
            throw new CantFindException();
        }

        return $res->toArray();
    }


}
<?php
/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 17-2-21
 * Time: 下午10:52
 */

namespace App\Repositories;

use Rinvex\Repository\Repositories\EloquentRepository;
use App\Repositories\Contract\ProfileRepositoryContract;

class ProfileEloquentRepository extends EloquentRepository implements ProfileRepositoryContract
{
    protected $repositoryId = 'rinvex.repository.profile';

    protected $model = 'App\Profile';


    public function updateUserProfile(int $profile_id, array $attributes)
    {
        return $this->update($profile_id, $attributes);
    }
}
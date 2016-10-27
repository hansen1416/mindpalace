<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-10-27
 * Time: 下午5:09
 */

namespace App\Services;

use App\Services\Contract\SpaceServiceContract;
use App\Repositories\Contract\SpaceRepositoryContract;

class SpaceService implements SpaceServiceContract
{

    protected $spaceRepo;


    public function __construct(
        SpaceRepositoryContract $spaceRepositoryContract
    )
    {
        $this->spaceRepo = $spaceRepositoryContract;
    }

    public function userService(int $user_id)
    {
        $this->spaceRepo->allSpace($user_id);
    }
}
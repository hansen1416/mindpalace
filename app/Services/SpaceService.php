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
use App\Services\Contract\UserServiceContract;


class SpaceService implements SpaceServiceContract
{

    protected $spaceRepo;


    protected $userService;


    public function __construct(
        SpaceRepositoryContract $spaceRepositoryContract,
        UserServiceContract $userServiceContract
    )
    {
        $this->spaceRepo   = $spaceRepositoryContract;
        $this->userService = $userServiceContract;
    }

    public function allSpace()
    {
        return $this->spaceRepo->allSpace($this->userService->userId());
    }


    public function searchSpace(string $name)
    {
        return $this->spaceRepo->searchUserSpaceByName($name, $this->userService->userId());
    }


    public function updateSpace($space_id)
    {
        $this->spaceRepo->update($space_id, ['name' => 'PHP5']);
    }


    public function createSpace($name)
    {
        return $this->spaceRepo->create([
                                            'user_id'    => $this->userService->userId(),
                                            'name'       => $name,
                                            'created_at' => date('Y-m-d H:i:s'),
                                        ]);
    }


    public function fetchUrl($url)
    {

    }


}
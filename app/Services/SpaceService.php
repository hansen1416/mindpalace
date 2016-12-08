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
use Auth;


class SpaceService implements SpaceServiceContract
{

    protected $spaceRepo;


    public function __construct(
        SpaceRepositoryContract $spaceRepositoryContract
    )
    {
        $this->spaceRepo = $spaceRepositoryContract;
    }

    public function allSpace()
    {
        $user_id = Auth::guard('api')->user() ? Auth::guard('api')->user()->user_id : null;
        return $this->spaceRepo->allSpace((int)$user_id);
    }


    public function searchSpace(string $name)
    {
        $user_id = Auth::guard('api')->user() ? Auth::guard('api')->user()->user_id : null;

        return $this->spaceRepo->searchUserSpaceByName($name, (int)$user_id);
    }


    public function updateSpace($space_id)
    {
        $this->spaceRepo->update($space_id, ['name' => 'PHP5']);
    }


    public function createSpace($name)
    {
        return $this->spaceRepo->create([
                                            'user_id'    => Auth::guard('api')->user()->user_id,
                                            'name'       => $name,
                                            'created_at' => date('Y-m-d H:i:s'),
                                        ]);
    }

}
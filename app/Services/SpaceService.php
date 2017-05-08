<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-10-27
 * Time: 下午5:09
 */

namespace App\Services;

use App\Repositories\Contract\SpaceRepositoryContract;
use App\Space;

class SpaceService extends BaseService
{

    protected $spaceRepo;


    public function __construct(
        SpaceRepositoryContract $spaceRepositoryContract
    )
    {
        parent::__construct();
        $this->spaceRepo = $spaceRepositoryContract;
    }

    /**
     * @return array
     */
    public function spaceServiceHomeSpaces(): array
    {
        return $this->spaceRepo->spaceRepositoryHomeSpaces($this->getUserId(true));
    }

    /**
     * @param string $name
     * @return array
     */
    public function searchSpace(string $name): array
    {
        return $this->spaceRepo->searchUserSpaceByName($name, $this->getUserId());
    }

    /**
     * @param string $name
     * @return Space
     */
    public function spaceServiceCreate(string $name): Space
    {
        return $this->spaceRepo->spaceRepositoryCreate([
                                                           'user_id' => $this->getUserId(),
                                                           'name'    => $name,
                                                       ]);
    }

    /**
     * @param int $space_id
     * @return Space
     */
    public function spaceServiceGetOne(int $space_id): Space
    {
        return $this->spaceRepo->getOne($space_id);
    }

    /**
     * @return array
     */
    public function spaceServiceUserSpaces(): array
    {
        return $this->spaceRepo->spaceRepositoryUserSpaces($this->getUserId());
    }

}
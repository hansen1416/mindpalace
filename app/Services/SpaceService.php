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
use Ratchet\ConnectionInterface;
use Hansen1416\WebSpace\Services\WebSpaceService;

class SpaceService implements SpaceServiceContract
{

    protected $spaceRepo;


    protected $userService;


    protected $webSpaceService;


    public function __construct(
        SpaceRepositoryContract $spaceRepositoryContract,
        UserServiceContract $userServiceContract,
        WebSpaceService $webSpaceService
    )
    {
        $this->spaceRepo       = $spaceRepositoryContract;
        $this->userService     = $userServiceContract;
        $this->webSpaceService = $webSpaceService;
    }


    public function allSpace()
    {
        return $this->spaceRepo->allSpace($this->userService->userId());
    }


    public function searchSpace(string $name)
    {
        return $this->spaceRepo->searchUserSpaceByName($name, $this->userService->userId());
    }


    public function updateSpace(int $space_id)
    {
        $this->spaceRepo->update($space_id, ['name' => 'PHP5']);
    }


    public function createSpace(string $name)
    {
        return $this->spaceRepo->create([
                                            'user_id'    => $this->userService->userId(),
                                            'name'       => $name,
                                            'created_at' => date('Y-m-d H:i:s'),
                                        ]);
    }


    public function saveWebsite(ConnectionInterface $conn, $url)
    {
echo 1;
        $this->webSpaceService->setConnection($conn);

        $spaceName = $this->webSpaceService->getTitleFromDocument($url);

        $conn->send($spaceName);
echo 2;
        $urls = $this->webSpaceService->pickAllUrlFromBody();

        if (!$urls) {
            $conn->send('no valid url, connection closed');
            $conn->close();
        }
echo 3;
        $conn->send(count($urls));

        $total   = count($urls);
        $success = 0;
        $failed  = 0;
echo 4;
//        foreach ($urls as $url) {
//            $data = $this->webSpaceService->getContentFromUrl($url);
//
//            if (false === $data) {
//                $failed += 1;
//                $conn->send('total ' . $total . ', ' . $success . ' success, ' . $failed . ' failed');
//            }
//
//
//            $success += 1;
//            $conn->send('total ' . $total . ', ' . $success . ' success, ' . $failed . ' failed');
//        }

    }


}
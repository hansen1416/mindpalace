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
use Hansen1416\WebSpace\Services\WebSpaceService;
use swoole_websocket_server;

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

    /**
     * @return array
     */
    public function allSpace()
    {
        return $this->spaceRepo->allSpace($this->userService->userId());
    }

    /**
     * @param string $name
     * @return array
     */
    public function searchSpace(string $name)
    {
        return $this->spaceRepo->searchUserSpaceByName($name, $this->userService->userId());
    }

    /**
     * @param int $space_id
     */
    public function updateSpace(int $space_id)
    {
        $this->spaceRepo->update($space_id, ['name' => 'PHP5']);
    }

    /**
     * @param string $name
     * @return array
     */
    public function createSpace(string $name)
    {
        return $this->spaceRepo->create([
                                            'user_id'    => $this->userService->userId(),
                                            'name'       => $name,
                                            'created_at' => date('Y-m-d H:i:s'),
                                        ]);
    }

    /**
     * @param swoole_websocket_server $server
     * @param                         $frame
     * @param                         $message
     * @param string                  $type message | error
     * @return bool
     */
    private function sendWebSocketMessage(swoole_websocket_server $server, $frame, $message, $type = 'message')
    {
        $data[$type] = $message;

        return $server->push($frame->fd, json_encode($data));
    }

    /**
     * @param swoole_websocket_server $server
     * @param                         $frame
     */
    public function saveWebsite(swoole_websocket_server $server, $frame)
    {

        try {
            $this->sendWebSocketMessage($server, $frame, 'getting content from url');

            $this->webSpaceService->setConnection($server, $frame);

            $spaceName = $this->webSpaceService->getTitleFromDocument($frame->data);

            $urls = $this->webSpaceService->pickAllUrlFromBody();

            $total   = count($urls);
            $success = 0;
            $failed  = 0;
            $string  = "totally %d, %d success, %d failed";

            $this->sendWebSocketMessage($server, $frame, $total);

            foreach ($urls as $url) {
                $content = $this->webSpaceService->getContentFromUrl($url);

                if (false === $content) {
                    $failed++;
                    $this->sendWebSocketMessage($server, $frame, sprintf($string, $total, $success, $failed));
                    continue;
                }


                $success++;
                $this->sendWebSocketMessage($server, $frame, sprintf($string, $total, $success, $failed));
            }


        } catch (\Exception $e) {
            $server->push($frame->fd, json_encode(['error' => $e->getMessage()]));
        }

    }


}
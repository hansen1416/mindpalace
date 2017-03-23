<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-10-27
 * Time: 下午5:09
 */

namespace App\Services;

use App\Exceptions\SaveFailedException;
use App\Services\Contract\SpaceServiceContract;
use App\Services\Contract\UserServiceContract;
use App\Services\Contract\CtgServiceContract;
use App\Repositories\Contract\SpaceRepositoryContract;
use Hansen1416\WebSpace\Services\WebSpaceService;
use swoole_websocket_server;
use DB;

class SpaceService extends BaseService implements SpaceServiceContract
{

    protected $spaceRepo;

    protected $ctgService;

    protected $webSpaceService;


    public function __construct(
        SpaceRepositoryContract $spaceRepositoryContract,
        CtgServiceContract $ctgServiceContract,
        WebSpaceService $webSpaceService
    )
    {
        parent::__construct();
        $this->spaceRepo       = $spaceRepositoryContract;
        $this->ctgService      = $ctgServiceContract;
        $this->webSpaceService = $webSpaceService;

    }

    /**
     * @return array
     */
    public function allSpace()
    {
        return $this->spaceRepo->allSpace($this->user_id);
    }

    /**
     * @param string $name
     * @return array
     */
    public function searchSpace(string $name)
    {
        return $this->spaceRepo->searchUserSpaceByName($name, $this->user_id);
    }

    /**
     * @param string $name
     * @return array
     */
    public function spaceServiceCreate(string $name)
    {
        try {
            DB::beginTransaction();

            $spaceCtg = $this->spaceServiceCreateNestable($name);

            DB::commit();

            return $this->returnModel($spaceCtg);
        } catch (\Exception $e) {
            return $this->returnException($e);
        }
    }

    /**
     * @param string $name
     * @return \App\SpaceCtg
     */
    public function spaceServiceCreateNestable(string $name)
    {
        $space = $this->spaceRepo->spaceRepositoryCreate([
                                                             'user_id' => $this->user_id,
                                                             'name'    => $name,
                                                         ]);

        return $this->ctgService->ctgServiceCreateNestable($name, 0, $space->space_id);
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

            $spaceName = $this->webSpaceService->getTitleFromDocument($frame->data);
            $urls      = $this->webSpaceService->pickAllUrlFromBody();
            $total     = count($urls);
            $success   = 0;
            $failed    = 0;
            $string    = "totally %d, %d success, %d failed";

            $this->sendWebSocketMessage($server, $frame, $total);

            DB::beginTransaction();

            $spaceCtg = $this->spaceServiceCreateNestable($spaceName);

            $space_id = $spaceCtg->space_id;
            $user_id  = $this->user_id;
            $pid      = $spaceCtg->ctg_id;
            $path     = $spaceCtg->path;

            foreach ($urls as $url) {
                $content = $this->webSpaceService->getContentFromUrl($url);

                if (!$content) {
                    $failed++;
                    $this->sendWebSocketMessage($server, $frame, sprintf($string, $total, $success, $failed));
                    continue;
                }

                $this->sendWebSocketMessage($server, $frame, json_encode([$space_id, $user_id, $pid, $path]));

                $this->saveCtgTree($content, $space_id, $user_id, $pid, $path);

                $success++;
                $this->sendWebSocketMessage($server, $frame, sprintf($string, $total, $success, $failed));
            }

//            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            $server->push($frame->fd, json_encode(['error' => $e->getMessage()]));
        }

    }


    private function saveCtgTree(array $ctgTree, $space_id, $user_id, $pid, $path)
    {
        foreach ($ctgTree as $key => $value) {


        }
    }


}
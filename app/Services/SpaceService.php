<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-10-27
 * Time: 下午5:09
 */

namespace App\Services;

use App\Services\Contract\SpaceServiceContract;
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
        return $this->spaceRepo->allSpace($this->getUserId());
    }

    /**
     * @param string $name
     * @return array
     */
    public function searchSpace(string $name)
    {
        return $this->spaceRepo->searchUserSpaceByName($name, $this->getUserId());
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
                                                             'user_id' => $this->getUserId(),
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

            $data = json_decode($frame->data);

            $spaceName = $this->webSpaceService->getTitleFromDocument($data->url);
            $urls      = $this->webSpaceService->pickAllUrlFromBody();
            $total     = count($urls);
            $success   = 0;
            $failed    = 0;
            $string    = "totally %d, %d success, %d failed";

            $this->sendWebSocketMessage($server, $frame, $total);

            DB::beginTransaction();

            $spaceCtg = $this->spaceServiceCreateNestable($spaceName);

            $space_id = $spaceCtg->space_id;
            $pid      = $spaceCtg->ctg_id;
            $tier     = $spaceCtg->tier + 1;
            $path     = $spaceCtg->path . $pid . '-';
            $count    = 0;

            foreach ([$urls[0]] as $url) {
                $content = $this->webSpaceService->getContentFromUrl($url);

                if (!$content) {
                    $failed++;
                    $this->sendWebSocketMessage($server, $frame, sprintf($string, $total, $success, $failed));
                    continue;
                }

                $this->createCtgTreeData($content, $pid, $space_id, $tier, $path, $count);

                $success++;
                $this->sendWebSocketMessage($server, $frame, sprintf($string, $total, $success, $failed));
            }

            $this->sendWebSocketMessage($server, $frame, $count . ' ctg saved');
            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            $this->sendWebSocketMessage($server, $frame, $e->getMessage(), 'error');
        }

    }

    /**
     * @param array $ctgTree
     * @param       $pid
     * @param       $space_id
     * @param       $tier
     * @param       $path
     * @param       $count
     */
    private function createCtgTreeData(array $ctgTree, $pid, $space_id, $tier, $path, &$count)
    {
        foreach ($ctgTree as $key => $value) {
            //create spaceCtg
            $spaceCtg = $this->ctgService->ctgServiceCreateNestable($value['title'], $pid, $space_id, $tier, $path);
            //create ctg content in item
            $this->ctgService->ctgServiceSaveCtgContent($spaceCtg->ctg_id, $value['content']);
            //if there is descendant, then recursion into it
            if ($value['desc']) {
                $this->createCtgTreeData(
                    $value['desc'],
                    $spaceCtg->ctg_id,
                    $space_id,
                    $spaceCtg->tier + 1,
                    $spaceCtg->path . $spaceCtg->ctg_id . '-',
                    $count
                );
            }
            $count++;
        }
    }


}
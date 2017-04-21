<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-10-27
 * Time: 下午5:46
 */

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SpaceService;
use App\Services\CtgService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use swoole_websocket_server;
use Hansen1416\WebSpace\Services\WebSpaceService;
use DB;

class SpaceController extends Controller
{
    private $space;

    private $ctg;

    private $webSpaceService;

    public function __construct(
        SpaceService $spaceService,
        CtgService $ctgService,
        WebSpaceService $webSpaceService
    )
    {
        $this->space           = $spaceService;
        $this->ctg             = $ctgService;
        $this->webSpaceService = $webSpaceService;
    }

    /**
     * @return JsonResponse
     */
    public function home(): JsonResponse
    {
        try {

            return $this->responseJson(
                $this->space->spaceServiceHomeSpaces()
            );
        } catch (\Exception $e) {
            return $this->responseJson($e);
        }
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function search(Request $request): JsonResponse
    {
        try {

            return $this->responseJson(
                $this->space->searchSpace($request->input('name', ''))
            );
        } catch (\Exception $e) {
            return $this->responseJson($e);
        }
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function create(Request $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $name  = $request->input('name');
            $space = $this->space->spaceServiceCreate($name);

            $this->ctg->ctgServiceCreate($name, 0, $space->space_id);

            DB::commit();
            return $this->responseJson($space);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->responseJson($e);
        }
    }

    /**
     * @param $space_id
     * @return JsonResponse
     */
    public function space($space_id): JsonResponse
    {
        try {

            return $this->responseJson(
                $this->space->spaceServiceGetOne($space_id)
            );
        } catch (\Exception $e) {
            return $this->responseJson($e);
        }
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

            $space = $this->space->spaceServiceCreate($spaceName);

            $spaceCtg = $this->ctg->ctgServiceCreate($space->name, 0, $space->space_id);

            $space_id = $spaceCtg->space_id;
            $pid      = $spaceCtg->ctg_id;
            $tier     = $spaceCtg->tier + 1;
            $path     = $spaceCtg->path . $pid . '-';
            $count    = 0;

            foreach ($urls as $url) {
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

        } catch (\Exception $e) {

            DB::rollBack();
            $this->sendWebSocketMessage($server, $frame, $e->getMessage(), 'error');

        }
    }

    /**
     * @param swoole_websocket_server $server
     * @param                         $frame
     * @param                         $message
     * @param string                  $type message | error
     * @return bool
     */
    private function sendWebSocketMessage(swoole_websocket_server $server, $frame, $message, $type = 'message'): bool
    {
        $data[$type] = $message;

        return $server->push($frame->fd, json_encode($data));
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
            $spaceCtg = $this->ctg->ctgServiceCreate($value['title'], $pid, $space_id, $tier, $path);
            //create ctg content in item
            $this->ctg->ctgServiceSaveCtgContent($spaceCtg->ctg_id, $value['content']);
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
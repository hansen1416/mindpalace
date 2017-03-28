<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-10-27
 * Time: 下午5:09
 */

namespace App\Services\Contract;

use swoole_websocket_server;
use App\SpaceCtg;

interface SpaceServiceContract
{
    /**
     * @return array
     */
    public function spaceServiceHomeSpaces(): array;

    /**
     * @param string $name
     * @return array
     */
    public function searchSpace(string $name): array;

    /**
     * @param string $name
     * @return SpaceCtg
     */
    public function spaceServiceCreate(string $name): SpaceCtg;

    /**
     * @param swoole_websocket_server $server
     * @param                         $frame
     */
    public function saveWebsite(swoole_websocket_server $server, $frame);

}
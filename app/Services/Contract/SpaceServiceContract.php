<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-10-27
 * Time: 下午5:09
 */

namespace App\Services\Contract;

use swoole_websocket_server;

interface SpaceServiceContract
{
    /**
     * @return mixed
     */
    public function allSpace();

    /**
     * @param string $name
     * @return mixed
     */
    public function searchSpace(string $name);

    /**
     * @param string $name
     * @return array
     */
    public function spaceServiceCreate(string $name);

    /**
     * @param string $name
     * @return \App\SpaceCtg
     */
    public function spaceServiceCreateNestable(string $name);

    /**
     * @param swoole_websocket_server $server
     * @param                         $frame
     * @return void
     */
    public function saveWebsite(swoole_websocket_server $server, $frame);

}
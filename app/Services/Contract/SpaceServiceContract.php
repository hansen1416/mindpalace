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
    public function allSpace();


    public function searchSpace(string $name);


    public function updateSpace(int $space_id);


    public function createSpace(string $name);


    public function saveWebsite(swoole_websocket_server $server, $frame);

}
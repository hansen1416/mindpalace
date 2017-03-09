<?php
/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 17-3-9
 * Time: 下午4:22
 */

namespace App;

use Ratchet\ConnectionInterface;
use Askedio\LaravelRatchet\RatchetServer;

class RatchetWebSocketServer extends RatchetServer
{
    public function onMessage(ConnectionInterface $conn, $input)
    {
        parent::onMessage($conn, $input);

        if (!$this->throttled) {
            $this->send($conn, 'Hello you.');

            $this->sendAll('Hello everyone.');

            $this->send($conn, 'Wait, I don\'t know you! Bye bye!');

            $this->abort($conn);
        }
    }
}
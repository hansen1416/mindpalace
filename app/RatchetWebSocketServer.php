<?php
/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 17-3-9
 * Time: 下午4:22
 */

namespace App;

use Ratchet\ConnectionInterface;
use Ratchet\Wamp\WampServerInterface;
use Hansen1416\LaravelRatchet\RatchetServer;

class RatchetWebSocketServer extends RatchetServer implements WampServerInterface
{
    public function onSubscribe(ConnectionInterface $conn, $topic)
    {
        $this->send($conn, 'aaaaaaa');
    }

    public function onUnSubscribe(ConnectionInterface $conn, $topic)
    {
        $this->send($conn, 'bbbbb');
    }

    public function onOpen(ConnectionInterface $conn)
    {
        $this->send($conn, 'ccccc');
    }

    public function onClose(ConnectionInterface $conn)
    {
        $this->send($conn, 'ddddd');
    }

    public function onCall(ConnectionInterface $conn, $id, $topic, array $params)
    {
        $this->send($conn, 'eeeee');
        // In this application if clients send data it's because the user hacked around in console
        $conn->callError($id, $topic, 'You are not allowed to make calls')->close();
    }

    public function onPublish(ConnectionInterface $conn, $topic, $event, array $exclude, array $eligible)
    {
        $this->send($conn, 'fffff');
        // In this application if clients send data it's because the user hacked around in console
        $conn->close();
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        $this->send($conn, 'gggg');
    }

    public function onMessage(ConnectionInterface $conn, $input)
    {
        parent::onMessage($conn, $input);

        $this->send($conn, 'hhhhhhh');

        if (!$this->throttled) {
            $this->send($conn, 'Hello you.');

            $this->sendAll('Hello everyone.');

            $this->send($conn, 'Wait, I don\'t know you! Bye bye!');

            $this->abort($conn);
        }
    }
}
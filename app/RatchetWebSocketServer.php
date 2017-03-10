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
use Askedio\LaravelRatchet\RatchetServer;

class RatchetWebSocketServer extends RatchetServer implements WampServerInterface
{
    public function onSubscribe(ConnectionInterface $conn, $topic)
    {
        $this->send($conn, 'iiiiiiiiiiiiiii');
    }

    public function onUnSubscribe(ConnectionInterface $conn, $topic)
    {
        $this->send($conn, 'iiiiiiiiiiiiiii');
    }

    public function onOpen(ConnectionInterface $conn)
    {
        $this->send($conn, 'iiiiiiiiiiiiiii');
    }

    public function onClose(ConnectionInterface $conn)
    {
        $this->send($conn, 'iiiiiiiiiiiiiii');
    }

    public function onCall(ConnectionInterface $conn, $id, $topic, array $params)
    {
        $this->send($conn, 'iiiiiiiiiiiiiii');
        // In this application if clients send data it's because the user hacked around in console
        $conn->callError($id, $topic, 'You are not allowed to make calls')->close();
    }

    public function onPublish(ConnectionInterface $conn, $topic, $event, array $exclude, array $eligible)
    {
        $this->send($conn, 'iiiiiiiiiiiiiii');
        // In this application if clients send data it's because the user hacked around in console
        $conn->close();
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        $this->send($conn, 'iiiiiiiiiiiiiii');
    }

    public function onMessage(ConnectionInterface $conn, $input)
    {
        parent::onMessage($conn, $input);

        $this->send($conn, 'dasdasdasdasdasdasdasdasd');

        if (!$this->throttled) {
            $this->send($conn, 'Hello you.');

            $this->sendAll('Hello everyone.');

            $this->send($conn, 'Wait, I don\'t know you! Bye bye!');

            $this->abort($conn);
        }
    }
}
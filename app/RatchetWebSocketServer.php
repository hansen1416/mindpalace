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
use Ratchet\MessageComponentInterface;

class RatchetWebSocketServer implements WampServerInterface, MessageComponentInterface
{

    protected $subscribedTopics = [];

    public function onSubscribe(ConnectionInterface $conn, $topic)
    {
        echo "subscribe\n";
        $this->subscribedTopics[$topic->getId()] = $topic;
    }


    public function onUnSubscribe(ConnectionInterface $conn, $topic)
    {
    }


    public function onMessage(ConnectionInterface $conn, $msg)
    {
        echo "onMessage\n";
        $conn->send("sever {$msg} onmessage back");
        // TODO: Implement onMessage() method.
    }


    public function onEntry($entry)
    {
        echo "entry\n";

        $entryData = json_decode($entry, true);

        print_r($this->subscribedTopics);

        // If the lookup topic object isn't set there is no one to publish to
        if (!isset($entryData['category']) || !array_key_exists($entryData['category'], $this->subscribedTopics)) {
            return;
        }

        $topic = $this->subscribedTopics[$entryData['category']];

        // re-send the data to all the clients subscribed to that category
        $topic->broadcast($entryData);
    }


    public function onOpen(ConnectionInterface $conn)
    {
        echo "connection open\n";
    }


    public function onClose(ConnectionInterface $conn)
    {
        echo "connection closed\n";
    }


    public function onCall(ConnectionInterface $conn, $id, $topic, array $params)
    {
        // In this application if clients send data it's because the user hacked around in console
        $conn->callError($id, $topic, 'You are not allowed to make calls')->close();
    }


    public function onPublish(ConnectionInterface $conn, $topic, $event, array $exclude, array $eligible)
    {
        echo "publish\n";
        // In this application if clients send data it's because the user hacked around in console
        $conn->close();
    }


    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "error\n";
    }
}
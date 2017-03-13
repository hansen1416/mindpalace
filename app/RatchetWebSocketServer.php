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

class RatchetWebSocketServer implements WampServerInterface {

    protected $subscribedTopics = array();

    public function onSubscribe(ConnectionInterface $conn, $topic) {
        echo 'subscribe';
        $this->subscribedTopics[$topic->getId()] = $topic;
    }


    public function onUnSubscribe(ConnectionInterface $conn, $topic) {
    }


    public function onEntry($entry) {
        $entryData = json_decode($entry, true);

        // If the lookup topic object isn't set there is no one to publish to
        if (!array_key_exists($entryData['category'], $this->subscribedTopics)) {
            return;
        }

        $topic = $this->subscribedTopics[$entryData['category']];

        // re-send the data to all the clients subscribed to that category
        $topic->broadcast($entryData);
    }


    public function onOpen(ConnectionInterface $conn) {
        echo 'open';
    }


    public function onClose(ConnectionInterface $conn) {
    }


    public function onCall(ConnectionInterface $conn, $id, $topic, array $params) {
        // In this application if clients send data it's because the user hacked around in console
        $conn->callError($id, $topic, 'You are not allowed to make calls')->close();
    }


    public function onPublish(ConnectionInterface $conn, $topic, $event, array $exclude, array $eligible) {
        echo 'close';
        // In this application if clients send data it's because the user hacked around in console
        $conn->close();
    }


    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo 'error';
    }
}
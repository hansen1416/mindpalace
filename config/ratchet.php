<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Laravel Ratchet Configuration
    |--------------------------------------------------------------------------
    |
    | Here you can define the default settings for Laravel Ratchet.
    |
    */

    'class'           => \App\Server\RatchetWebSocketServer::class,
    'host'            => '0.0.0.0',
    'port'            => '8080',
    'connectionLimit' => false,
    'throttle'        => [
                            'onOpen'    => '50:1',
                            'onMessage' => '200:1',
                         ],
    'abortOnMessageThrottle' => false,
    'blackList'              => collect([]),
    'zmq'                    => [
        'host' => '127.0.0.1',
        'port' => 5555,
      ],
];

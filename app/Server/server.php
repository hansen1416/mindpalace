<?php
/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 17-3-21
 * Time: 下午8:49
 */

$ws = new swoole_websocket_server("0.0.0.0", 8888);

$ws->on('open', function ($ws, $request) {
    var_dump($request->fd, $request->get, $request->server);
    $ws->push($request->fd, "hello, connect\n");
});

$ws->on('message', function ($ws, $frame) {
    echo "Message: {$frame->data}\n";
    if($frame->data === 'start'){

//        runCurl('http://localhost/swoole_test.php',array('fd'=>json_encode($frame->fd)));
    }

    if(strpos($frame->data,'client')!==false){
        $client = explode('-',$frame->data);
        $ws->push($client[1],'server: '.$client[2]);
    }
    $ws->push($frame->fd, "server: begin");
});

$ws->on('close', function ($ws, $fd) {
    echo "client-{$fd} is closed\n";
});

$ws->start();


function runCurl( $url = null ,$data, $timeout = 2 ) {
    if ( empty( $url ) ) {
        return;
    }
    $_header = array( "User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_0) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11" );

    $_ch     = curl_init();
    curl_setopt( $_ch , CURLOPT_URL , $url );
    curl_setopt( $_ch , CURLOPT_RETURNTRANSFER , 1 );
    curl_setopt( $_ch , CURLOPT_TIMEOUT , $timeout );
    curl_setopt( $_ch , CURLOPT_CONNECTTIMEOUT , 20 );
    curl_setopt( $_ch , CURLOPT_SSL_VERIFYPEER , false );
    curl_setopt( $_ch , CURLOPT_HTTPHEADER , $_header );
    // post数据
    curl_setopt($_ch, CURLOPT_POST, 1);
    // post的变量
    curl_setopt($_ch, CURLOPT_POSTFIELDS, $data);
    return curl_exec( $_ch );
}

function test($ws,$fd,$val){
    $ws->push($fd,$val);
}


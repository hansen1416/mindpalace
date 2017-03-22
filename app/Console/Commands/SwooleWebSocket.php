<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use swoole_websocket_server;
use App\Services\Contract\SpaceServiceContract;

class SwooleWebSocket extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'swoole:websocket {action}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'swoole web socket start';

    /** @var  swoole_websocket_server */
    private $server;


    private $space;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(
        SpaceServiceContract $spaceServiceContract
    )
    {
        parent::__construct();

        $this->space = $spaceServiceContract;
    }

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function handle()
    {
        switch ($this->argument('action')) {
            case 'start':
                $this->start();
                break;
            case 'stop':
                $this->stop();
                break;
            case 'restart':
                $this->restart();
                break;
            default:
                $this->error("  wrong action argument, expecting start | stop | restart");
        }

    }

    /**
     * start swoole web socket
     */
    private function start()
    {
        $this->info('swoole websocket start');

        $this->server = new swoole_websocket_server('127.0.0.1', 9501);

        $this->server->on('open', function (swoole_websocket_server $server, $request) {
            $this->info("server: handshake success with fd{$request->fd}\n");
        });

        $this->server->on('message', function (swoole_websocket_server $server, $frame) {
            $this->info("receive from {$frame->fd}: {$frame->data}, opcode: {$frame->opcode}, fin: {$frame->finish}\n");

            $this->space->saveWebsite($server, $frame);
        });

        $this->server->on('close', function (swoole_websocket_server $server, $frame) {
            $this->info("client {$frame} closed\n");
        });

        $this->server->start();
    }


    private function stop()
    {

    }


    private function restart()
    {

    }


}

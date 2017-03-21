/**
 * Created by hlz on 17-2-15.
 */
import {Injectable} from '@angular/core';
import {Subject}    from 'rxjs/Subject';

import {WebSocketService} from '../websocket/web-socket.service';

@Injectable()
export class MessageService {

    public showMessage = false;

    private messageSource = new Subject<string>();

    public message$ = this.messageSource.asObservable();

    public webSocket: WebSocketService;

    constructor() {
//         this.webSocket = new WebSocketService('ws://127.0.0.1:8080');
//
//         // this.webSocket.connect();
//
//         // this.webSocket.onMessage(
//         //     (msg: MessageEvent) => {
//         //         this.show(msg.data);
//         //         console.log(msg.data);
//         //     },
//         //     {autoApply: false}
//         // );
//
// // // set received message stream
//         this.webSocket.getDataStream().subscribe(
//             (msg) => {
//                 this.show(msg.data);
//                 console.log('Server time:'+msg.data +'--Client time:'+new Date().getTime());
//             },
//             (msg) => {
//                 console.log("error", msg);
//             },
//             () => {
//                 console.log("complete");
//             }
//         );

        let wsUri     = "ws://localhost:9050/websocket";
        let protocols = ['jsonrpc'];
        let websocket = new WebSocket(wsUri, protocols);

        function send(message) {
            websocket.send(message);
            console.log(message);
        }

        websocket.onopen    = function (evt) {
            console.log('Connection opened' + evt);
        };
        websocket.onclose   = function (evt) {
            console.log(evt);
        };
        websocket.onmessage = function (evt) {
            console.log(evt);
        };
        websocket.onerror   = function (evt) {
            console.log(evt);
        };

    }

    show(value: string) {
        this.showMessage = true;
        this.messageSource.next(value);
    }

    hide() {
        this.showMessage = false;
        this.messageSource.next('');
    }
}
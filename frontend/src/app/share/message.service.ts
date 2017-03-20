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
        this.webSocket = new WebSocketService('ws://127.0.0.1:8080');

        // this.webSocket.connect();

        // this.webSocket.onMessage(
        //     (msg: MessageEvent) => {
        //         this.show(msg.data);
        //         console.log(msg.data);
        //     },
        //     {autoApply: false}
        // );

// // set received message stream
        this.webSocket.getDataStream().subscribe(
            (msg) => {
                this.show(msg.data);
                console.log('Server time:'+msg.data +'--Client time:'+new Date().getTime());
            },
            (msg) => {
                console.log("error", msg);
            },
            () => {
                console.log("complete");
            }
        );
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
/**
 * Created by hlz on 17-2-15.
 */
import {Injectable} from '@angular/core';
import {Subject}    from 'rxjs/Subject';

import {WebSocketService} from '../websocket/web-socket.service';
import {UserService} from '../core/user.service';

@Injectable()
export class MessageService {

    public showMessage = false;

    private messageSource = new Subject<string>();

    public message$ = this.messageSource.asObservable();

    public webSocket: WebSocketService;

    constructor(
        private userService: UserService
    ) {
        this.setWebSocket();
    }

    setWebSocket(): void {
        let token = this.userService.getUserProperty('access_token');

        console.log(token);
        
        if (!token) {
            return;
        }

        this.webSocket = new WebSocketService('ws://' + token + '@127.0.0.1:9501');

        // set received message stream
        this.webSocket.getDataStream().subscribe(
            (msg) => {
                this.show(msg.data);
                console.log(msg.data);
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
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

    }

    setWebSocket(): void {
        let user_id = this.userService.getUserProperty('user_id');

        if (!user_id) {
            return;
        }

        this.webSocket = new WebSocketService('ws://127.0.0.1:9501?user_id=' + user_id);

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
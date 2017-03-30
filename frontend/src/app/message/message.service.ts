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

    private timeOut;

    constructor(
        private userService: UserService
    ) {

    }

    setWebSocket(): void {
        //if there is already a web socket, return
        if (this.webSocket instanceof WebSocketService) {
            return;
        }
        //if there is no user_id, return
        let user_id = this.userService.getUserProperty('user_id');

        if (!user_id) {
            return;
        }

        this.webSocket = new WebSocketService('ws://127.0.0.1:9501?user_id=' + user_id);

        // set received message stream
        this.webSocket.getDataStream().subscribe(
            (msg) => {
                this.showFlashMessage(msg.data);
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

    /**
     * close web socket
     */
    endWebSocket() {
        this.webSocket.close();
    }

    /**
     * display a flash message, hide it after 5 seconds
     * @param value
     */
    protected showFlashMessage(value: string) {
        this.showMessage = true;
        this.messageSource.next(value);
        //if there is a timer, clear it first
        if (this.timeOut) {
            clearTimeout(this.timeOut);
        }
        //hide flash message after 5 seconds
        this.timeOut = setTimeout(() => {
            this.hide();
            delete this.timeOut;
        }, 5000);
    }

    protected hide() {
        this.showMessage = false;
        this.messageSource.next('');
    }

    /**
     * show response message
     * @param response
     * @param callback
     */
    handleResponse(response: any, callback: Function | string) {
        if (response.status == 500) {
            this.showFlashMessage(response.error);
        } else {
            if (callback instanceof Function) {
                callback();
            } else if (typeof callback == 'string') {
                this.showFlashMessage('message.' + callback);
            }
        }
    }


}
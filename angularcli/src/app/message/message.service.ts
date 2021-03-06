/**
 * Created by hlz on 17-2-15.
 */
import {Injectable} from '@angular/core';
import {Subject}    from 'rxjs/Subject';

import {WebSocketService} from '../websocket/web-socket.service';
import {UserService} from '../core/user.service';
import {environment} from '../../environments/environment';

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
        return;

        // //if there is already a web socket, return
        // if (this.webSocket instanceof WebSocketService) {
        //     return;
        // }
        // //if there is no user_id, return
        // let user_id = this.userService.getUserProperty('user_id');
        //
        // if (!user_id) {
        //     return;
        // }
        //
        // this.webSocket = new WebSocketService();
        // this.webSocket.setUrl(environment.ws + '?user_id=' + user_id);
        //
        // // set received message stream
        // this.webSocket.getDataStream().subscribe(
        //     (msg) => {
        //         this.showFlashMessage(msg.data);
        //         console.log(msg.data);
        //     },
        //     (msg) => {
        //         console.log("error", msg);
        //     },
        //     () => {
        //         console.log("complete");
        //     }
        // );
    }

    /**
     * close web socket
     */
    endWebSocket() {
        if (this.webSocket instanceof WebSocketService) {
            this.webSocket.close();
        }
    }

    /**
     * display a flash message, hide it after 5 seconds
     * @param value
     */
    showFlashMessage(value: string) {
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
     * @param success
     * @param callback
     */
    handleResponse(response: any, success: Function | string, callback?: Function) {
        if (response.status == 500) {
            this.showFlashMessage(response.error);
        } else {
            if (success instanceof Function) {
                success();
            } else if (typeof success == 'string') {
                this.showFlashMessage('message.' + success);
            }
        }

        if (callback && callback instanceof Function) {
            callback();
        }
    }


}
/**
 * Created by hlz on 17-3-13.
 */
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import {WebSocketService} from './web-socket.service';

const CHAT_URL = 'ws://127.0.0.1:8080/';

export interface Message {
    author: string,
    message: string
}

@Injectable()
export class PushService {
    public messages: Subject<Message>;

    constructor(webSocketService: WebSocketService) {
        this.messages = <Subject<Message>>webSocketService
            .connect(CHAT_URL)
            .map((response: MessageEvent): Message => {
                let data = JSON.parse(response.data);
                return {
                    author : data.author,
                    message: data.message
                }
            });
    }
}
/**
 * Created by hlz on 17-2-15.
 */
import {Component} from '@angular/core';

import {MessageService} from './message.service';

@Component({
               selector:    'message',
               templateUrl: './html/message.component.html',
               styles:      [require('./scss/message.component.scss')]
           })
export class MessageComponent {

    showMessage: boolean;

    message: string = 'ddd';

    constructor(
        private messageService: MessageService
    ) {
        this.showMessage = messageService.showMessage;
    }


}
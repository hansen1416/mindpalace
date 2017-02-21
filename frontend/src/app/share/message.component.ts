/**
 * Created by hlz on 17-2-15.
 */
import {Component, OnDestroy} from '@angular/core';

import {MessageService} from './message.service';
import {Subscription}   from 'rxjs/Subscription';

@Component({
               selector   : 'message',
               templateUrl: './html/message.component.html',
               styles     : [require('./scss/message.component.scss')]
           })
export class MessageComponent implements OnDestroy {

    showMessage: boolean;

    message: string;

    subscription: Subscription;

    constructor(
        private messageService: MessageService
    ) {
        this.subscription = messageService.message$.subscribe(
            message => {
                this.showMessage = this.messageService.showMessage;
                this.message     = message;
            }
        )
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
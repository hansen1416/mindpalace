import {Component, OnInit} from '@angular/core';

import {UserService} from './core/user.service';
import {ApiRoutesService} from './share/api-routes.service';
import {ApiHttpService} from './share/api-http.service';
import {MessageService} from './share/message.service';

@Component({
               selector:    'my-app',
               templateUrl: 'app.component.html',
               styles:      [require("./app.component.scss")],
           })
export class AppComponent implements OnInit {


    constructor(
        private userService: UserService,
        private apiRoutesService: ApiRoutesService,
        private apiHttpService: ApiHttpService,
        private messageService: MessageService,
    ) {
    }

    ngOnInit() {
        let token = this.userService.getLocalAccessToken();

        if (!this.userService.getUserProperty('access_token') && token) {

            this.userService.setUserProperties({'access_token': token});

            this.apiHttpService.get(this.apiRoutesService.user).subscribe(
                response => {
                    this.userService.saveUserModel(response);
                    this.messageService.setWebSocket();
                }
            );
        }

    }

}
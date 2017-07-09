import {Component, OnInit} from '@angular/core';

import {UserService} from './core/user.service';
import {ApiRoutesService} from './share/api-routes.service';
import {ApiHttpService} from './share/api-http.service';
import {MessageService} from './message/message.service';

@Component({
               selector   : 'app-root',
               templateUrl: 'app.component.html',
               styleUrls  : ['./app.component.scss'],
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
                    //when failed to get user data, clear user model,
                    //useful when local access_token expired
                    if (response.status == 500) {
                        this.userService.clearUserModel();
                        return;
                    }
                    this.userService.saveUserModel(response);
                    this.messageService.setWebSocket();
                }
            );
        }

    }

}

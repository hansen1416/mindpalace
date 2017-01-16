import {Component, OnInit} from '@angular/core';

import {StorageService} from './share/storage.service';
import {UserService} from './core/user.service';
import {ApiRoutesService} from './share/api-routes.service';
import {ApiHttpService} from './share/api-http.service';

@Component({
               selector   : 'my-app',
               templateUrl: 'app.component.html',
               styles     : [require("./app.component.scss")],
           })
export class AppComponent implements OnInit {


    constructor(
        private storageService: StorageService,
        private userService: UserService,
        private apiRoutesService: ApiRoutesService,
        private apiHttpService: ApiHttpService,
    ) {}

    ngOnInit() {
        let token = this.storageService.getItem('access_token');
        if (!this.userService.getUserProperty('access_token') && token) {

            this.userService.setUserProperties({'access_token': token});

            this.apiHttpService.get(this.apiRoutesService.user).subscribe(
                response => this.userService.saveUserModel(response)
            );
        }

    }
}
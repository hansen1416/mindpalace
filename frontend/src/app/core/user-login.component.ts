/**
 * Created by mok on 16-10-12.
 */
import {Component} from '@angular/core';

import {UserService} from "./user.service";
import {ApiRoutesService} from '../share/api-routes.service';
import {ApiHttpService} from "../share/api-http.service";


@Component({
               selector:    'user-login',
               templateUrl: './html/user-login.component.html',
               styles:      [require('./scss/user-login.component.scss')]
           })
export class UserLoginComponent {

    constructor(
        private userService: UserService,
        private apiRoutes: ApiRoutesService,
        private apiHttp: ApiHttpService,
    ) {
    }


    submitted = false;

    user = this.userService.getUserModel();


    onSubmit() {
        this.submitted = true;

        let formData = new FormData();

        formData.append('email', this.user.email);
        formData.append('password', this.user.password);

        this.apiHttp.post(this.apiRoutes.login, formData).subscribe(
            res => {
                this.userService.setUserProperty({
                                                     access_token:  res.access_token,
                                                     refresh_token: res.refresh_token
                                                 });
            }
        );


    }

}
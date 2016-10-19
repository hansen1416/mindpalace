/**
 * Created by mok on 16-10-12.
 */
import {Component} from '@angular/core';

import {UserService} from "./user.service";
import {ApiRoutesService} from '../share/api-routes.service';


@Component({
               selector   : 'user-login',
               templateUrl: './html/user-login.component.html',
               styles     : [require('./scss/user-login.component.scss')]
           })
export class UserLoginComponent {

    constructor(
        private userService: UserService,
        private apiRoutes: ApiRoutesService,
    ) {}


    public user = this.userService.getUserModel();


    submitted = false;


    onSubmit() {
        this.submitted = true;

        this.userService.authenticate(this.apiRoutes.login).subscribe(
            res => {
                this.userService.setUserProperty({
                                                     access_token : res.access_token,
                                                     refresh_token: res.refresh_token
                                                 });
            }
        )

    }

}
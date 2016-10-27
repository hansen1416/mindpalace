/**
 * Created by mok on 16-10-12.
 */
import {Component} from '@angular/core';

import {UserService} from "./user.service";
import {ApiRoutesService} from '../share/api-routes.service';
import {ApiHttpService} from "../share/api-http.service";


@Component({
               selector   : 'user-login',
               templateUrl: './html/user-login.component.html',
               styles     : [require('./scss/user-login.component.scss')]
           })
export class UserLoginComponent {

    constructor(
        private userService: UserService,
        private apiRoutes: ApiRoutesService,
        private apiHttp: ApiHttpService,
    ) {
    }


    user = this.userService.getUserModel();


    invalidEmail = false;


    checkEmail() {
        let pattern = /@([a-zA-Z0-9\-])+\./;

        this.invalidEmail = pattern.test(this.user.email) ? false : true;
    }


    onSubmit() {

        let formData = new FormData();

        formData.append('email', this.user.email);
        formData.append('password', this.user.password);

        this.apiHttp.post(this.apiRoutes.login, formData).subscribe(
            response => {
                this.userService.setUserProperties(response);

                this.apiHttp.get(this.apiRoutes.user).subscribe(
                    response => {
                        this.userService.setUserProperties(response);
                        
                        console.log(this.user);
                    }
                )
                
            }
        );

    }

}
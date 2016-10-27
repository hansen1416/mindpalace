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

    /**
     * invalid email format
     * @type {boolean}
     */
    invalidEmail = false;

    /**
     * authenticate failed
     */
    authError = false;

    /**
     * check email format
     */
    checkEmail() {
        let pattern = /@([a-zA-Z0-9\-])+\./;

        this.invalidEmail = pattern.test(this.user.email) ? false : true;
    }

    /**
     * submit login form
     */
    onSubmit() {

        let formData = new FormData();

        formData.append('email', this.user.email);
        formData.append('password', this.user.password);

        this.apiHttp.post(this.apiRoutes.login, formData).subscribe(
            response => {
                this.userService.setUserProperties({
                                                       access_token : response.access_token,
                                                       refresh_token: response.refresh_token,
                                                   });

                /**
                 * if authenticated
                 */
                if (this.user.access_token) {
                    this.apiHttp.get(this.apiRoutes.user).subscribe(
                        response => {

                            let profile = response.profile;
                            delete response.profile;
                            delete profile.profile_id;

                            this.userService.setUserProperties(response, profile);
                            this.userService.sealUserModel();
                            
                            console.log(this.user);
                        }
                    )
                }else{
                    this.authError = true;
                }

            }
        );

    }

}
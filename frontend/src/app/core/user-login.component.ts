/**
 * Created by hlz on 16-10-12.
 */
import {Component, OnDestroy} from '@angular/core';

import {Subscription}   from 'rxjs/Subscription';

import {UserService} from "./user.service";
import {ApiRoutesService} from '../share/api-routes.service';
import {ApiHttpService} from "../share/api-http.service";
import {SpaceService} from "../space/space.service";
import {ConcentricService} from "../space/concentric.service";

import {languages} from '../lang/lang-available';

@Component({
               selector   : 'user-login',
               templateUrl: './html/user-login.component.html',
               styles     : [require('./scss/user-login.component.scss')]
           })
export class UserLoginComponent implements OnDestroy{
    
    private subscription: Subscription;

    constructor(
        private userService: UserService,
        private apiRoutes: ApiRoutesService,
        private apiHttp: ApiHttpService,
        private spaceService: SpaceService,
        private concentricService: ConcentricService,
    ) {
        this.subscription = userService.userModel$.subscribe(
            userModel => {
                this.user = userModel;
            }
        );
    }

    private user = this.userService.getUserModel();

    /**
     * invalid email format
     * @type {boolean}
     */
    private invalidEmail = false;

    /**
     * authenticate failed
     */
    private authError = false;


    private languages = languages;

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

                    this.userService.saveLocalAccessToken(this.user.access_token);

                    this.apiHttp.get(this.apiRoutes.user).subscribe(
                        response => {

                            this.userService.saveUserModel(response);

                            this.spaceService.getHomeSpaceList().subscribe(response => {

                                this.spaceService.setSpaces = this.concentricService.setConcentricCircles(response);
                                this.spaceService.addEmptySpace();
                            });

                        }
                    );
                } else {
                    this.authError = true;
                }

            }
        );

    }

    //switch user language
    switchLang(language) {
        this.userService.setUserProperties({language: language.key});
    }


    ngOnDestroy(){
        this.subscription.unsubscribe();
    }
}
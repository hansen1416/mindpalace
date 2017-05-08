/**
 * Created by hlz on 16-10-12.
 */
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription}   from 'rxjs/Subscription';

import {UserService} from "./user.service";
import {ApiRoutesService} from '../share/api-routes.service';
import {ApiHttpService} from "../share/api-http.service";
import {SpaceService} from "../space/space.service";
import {MessageService} from '../message/message.service';

import {languages} from '../lang/lang-available';

@Component({
               selector   : 'user-login',
               templateUrl: './html/user-login.component.html',
               styleUrls : ['./scss/user-login.component.scss']
           })
export class UserLoginComponent implements OnInit, OnDestroy {

    private subscription: Subscription;

    public user = this.userService.getUserModel();

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

    private timeString = new Date().getTime();


    constructor(
        private userService: UserService,
        private apiRoutes: ApiRoutesService,
        private apiHttp: ApiHttpService,
        private spaceService: SpaceService,
        private messageService: MessageService,
    ) {

        this.subscription = userService.userModel$.subscribe(
            userModel => {
                this.user = userModel;
            }
        );
    }

    ngOnInit() {

    }


    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /**
     * check email format
     */
    checkEmail() {
        this.invalidEmail = !this.userService.emailPattern.test(this.user.email);
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
                    //get user profile form server
                    this.apiHttp.get(this.apiRoutes.user).subscribe(
                        response => {

                            this.userService.saveUserModel(response);
                            //open web socket which has been closed while logout
                            this.messageService.setWebSocket();

                            this.spaceService.getHomeSpaceList().subscribe(response => {

                                this.spaceService.setSpaces(response);
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

}
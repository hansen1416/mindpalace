/**
 * Created by mok on 16-10-12.
 */
import {Component} from '@angular/core';

import {UserService} from "./user.service";


@Component({
               selector   : 'user-login',
               templateUrl: './html/user-login.component.html',
               styles     : [require('./scss/user-login.component.scss')]
           })
export class UserLoginComponent {

    constructor(
        private userService: UserService,
    ) {}


    public user = this.userService.getUserModel();


    submitted = false;


    switchLang() {
        let lang = this.user.userLanguage == 'zh' ? 'en' : 'zh';
        this.userService.setUserLanguage(lang);
    }


    onSubmit() {
        this.submitted = true;

        console.log(this.user);
    }

}
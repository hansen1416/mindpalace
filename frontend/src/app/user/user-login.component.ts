/**
 * Created by mok on 16-10-12.
 */
import {Component} from '@angular/core';

import {UserService} from "./user.service";
// import {TranslateService} from 'ng2-translate/ng2-translate';

@Component({
               selector   : 'user-login',
               templateUrl: './html/user-login.component.html',
               styles     : [require('./scss/user-login.component.scss')]
           })
export class UserLoginComponent {

    constructor(
        // private translate:TranslateService,
        private userService: UserService,
    ) {

    }

    public model = this.userService.getUserModel();

    submitted = false;


    onSubmit() {
        this.submitted = true;

        // this.translate.use('en');
    }

}
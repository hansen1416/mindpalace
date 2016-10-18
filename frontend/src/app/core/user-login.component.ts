/**
 * Created by mok on 16-10-12.
 */
import {Component} from '@angular/core';

import {UserService} from "./user.service";
import {LangService} from "../lang/lang.service";


@Component({
               selector   : 'user-login',
               templateUrl: './html/user-login.component.html',
               styles     : [require('./scss/user-login.component.scss')]
           })
export class UserLoginComponent {

    constructor(
        private userService: UserService,
        private langService: LangService,
    ) {

    }

    public model = this.userService.getUserModel();

    submitted = false;


    onSubmit() {
        this.submitted = true;

        let l = this.langService.getLang();
        
        console.log(l);
    }

}
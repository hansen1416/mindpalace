/**
 * Created by mok on 16-10-12.
 */
import {Component} from '@angular/core';
import {LangService} from '../lang/lang.service';

import {User} from './user';

@Component({
               selector   : 'user-login',
               templateUrl: './html/user-login.component.html',
               styles     : [require('./scss/user-login.component.scss')]
           })
export class UserLoginComponent {

    constructor(public lang: LangService) {

    }

    model = new User(0, '', '', '');

    submitted = false;


    onSubmit() {
        this.submitted = true;

        console.log(this.lang.getLang('email-placeholder'));

        console.log(this.model);
    }

}
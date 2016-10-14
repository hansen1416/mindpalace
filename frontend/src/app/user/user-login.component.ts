/**
 * Created by mok on 16-10-12.
 */
import {Component} from '@angular/core';

import {User} from './user';

@Component({
               // moduleId   : module.id,
               selector   : 'user-login',
               templateUrl: './html/user-login.component.html',
               styles  : [require('./scss/user-login.component.scss')]
           })
export class UserLoginComponent {

    model = new User(0, '', '', '');

    submitted = false;

    onSubmit() {
        this.submitted = true;

        console.log(this.model);
    }

}
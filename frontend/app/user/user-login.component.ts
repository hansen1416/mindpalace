/**
 * Created by mok on 16-10-12.
 */
import {Component} from '@angular/core';

import {User} from './user';

@Component({
               moduleId   : module.id,
               selector   : 'user-login',
               templateUrl: './html/user-login.component.html'
           })
export class UserLoginComponent {

    model = new User(0, 'username');

    submitted = false;

    onSubmit() { this.submitted = true; }

    // TODO: Remove this when we're done
    get diagnostic() { return JSON.stringify(this.model); }
}
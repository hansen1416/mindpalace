/**
 * Created by hlz on 17-2-19.
 */
import {Component} from '@angular/core';

import {UserService} from '../core/user.service';

@Component({
               selector:    'profile',
               templateUrl: './html/profile.component.html',
               styles:      [require('./scss/profile.component.scss')]
           })
export class ProfileComponent {

    constructor(
        private userService: UserService
    ) {
        console.log(this.user);
    }

    private user = this.userService.getUserModel();

    private showPortraitEdit = false;

    clickPortrait() {
        this.showPortraitEdit = true;
    }
}
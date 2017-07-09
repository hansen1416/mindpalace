import {Component, OnInit, OnDestroy} from '@angular/core';

import {UserService} from '../core/user.service';

@Component({
               selector   : 'help',
               templateUrl: 'html/help.component.html',
               styleUrls  : ['scss/help.component.scss']
           })
export class HelpComponent implements OnInit, OnDestroy {

    public user = this.userService.getUserModel();

    constructor(
        private userService: UserService
    ) { }

    ngOnInit() {
        document.body.style.overflowY = 'auto';
    }

    ngOnDestroy() {
        document.body.style.overflowY = 'hidden';
    }

}

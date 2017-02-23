/**
 * Created by hlz on 17-2-23.
 */
import {Component} from '@angular/core';

import {ApiRoutesService} from '../share/api-routes.service';
import {ApiHttpService} from "../share/api-http.service";

@Component({
               selector   : 'user-register',
               templateUrl: './html/user-register.component.html',
               styles     : [require('./scss/user-register.component.scss')]
           })
export class UserRegisterComponent {

    constructor(
        private apiRoutesService: ApiRoutesService,
        private apiHttpService: ApiHttpService,
    ) {

    }
}
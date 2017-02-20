/**
 * Created by hlz on 17-2-19.
 */
import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';

import {UserService} from '../core/user.service';
import {ApiHttpService} from '../share/api-http.service';
import {ApiRoutesService} from '../share/api-routes.service';

import {languages} from '../lang/lang-available';

@Component({
               selector:    'profile',
               templateUrl: './html/profile.component.html',
               styles:      [require('./scss/profile.component.scss')]
           })
export class ProfileComponent {

    constructor(
        private userService: UserService,
        private apiHttpService: ApiHttpService,
        private apiRoutesService: ApiRoutesService
    ) {
        console.log(this.user);
    }

    private user = this.userService.getUserModel();


    private languages = languages;


    chooseFile() {
        let fileInput = document.getElementById('file-input');
        fileInput.click();
    }


    readFile(input) {
        let reader = new FileReader();

        reader.onload = function (event: any) {
            // THIS.showStandBy(event.target.result);
            let img = document.getElementById('portrait');

            img.setAttribute('src', event.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }

    profileSubmit(form: NgForm) {
        console.log(form);
    }


    logOut() {
        this.apiHttpService.get(this.apiRoutesService.logout).subscribe(
            response => {
                console.log(response);
            }
        );
    }


}
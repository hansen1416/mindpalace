/**
 * Created by hlz on 17-2-19.
 */
import {Component, OnDestroy} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router}  from '@angular/router';

import {Subscription}   from 'rxjs/Subscription';

import {UserService} from '../core/user.service';
import {ApiHttpService} from '../share/api-http.service';
import {ApiRoutesService} from '../share/api-routes.service';

import {languages} from '../lang/lang-available';

@Component({
               selector   : 'profile',
               templateUrl: './html/profile.component.html',
               styles     : [require('./scss/profile.component.scss')]
           })
export class ProfileComponent implements OnDestroy{

    private subscription: Subscription;

    constructor(
        private router: Router,
        private userService: UserService,
        private apiHttpService: ApiHttpService,
        private apiRoutesService: ApiRoutesService
    ) {
        this.subscription = userService.userModel$.subscribe(
            userModel => {
                this.user = userModel;
            }
        )
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
        this.userService.clearUserModel();
        this.router.navigate(['/home']);
    }


    ngOnDestroy(){
        this.subscription.unsubscribe();
    }

}
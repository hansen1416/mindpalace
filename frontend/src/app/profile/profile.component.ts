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
import {MessageService} from '../message/message.service';

import {languages} from '../lang/lang-available';

@Component({
               selector   : 'profile',
               templateUrl: './html/profile.component.html',
               styles     : [require('./scss/profile.component.scss')]
           })
export class ProfileComponent implements OnDestroy {

    private subscription: Subscription;

    constructor(
        private router: Router,
        private userService: UserService,
        private apiHttpService: ApiHttpService,
        private apiRoutesService: ApiRoutesService,
        private messageService: MessageService,
    ) {
        this.subscription = userService.userModel$.subscribe(
            userModel => {
                this.user = userModel;
            }
        );
    }

    private user = this.userService.getUserModel();


    private languages = languages;

    /**
     * choose local file
     */
    chooseFile() {
        let fileInput = document.getElementById('file-input');
        fileInput.click();
    }

    /**
     * get img file
     * @param input
     */
    readFile(input): void {
        let reader = new FileReader();

        reader.onload = function (event: any) {
            // THIS.showStandBy(event.target.result);
            let img = document.getElementById('portrait');

            img.setAttribute('src', event.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }

    /**
     * submit profile info
     * @param form
     */
    profileSubmit(form: NgForm): void {
        let data = new FormData();

        for (let prop in form.value) {
            if (form.value.hasOwnProperty(prop)) {
                data.append(prop, form.value[prop]);
            }
        }

        let fileInput = <HTMLInputElement>document.getElementById('file-input');

        if (fileInput.files.length) {
            data.append('portrait', fileInput.files[0]);
        }

        this.apiHttpService.post(this.apiRoutesService.updateProfile, data).subscribe(
            response => {
                if (response.status == 500) {
                    this.messageService.show(response.error);
                } else {
                    this.userService.setUserProperties(response);
                }
            }
        );
    }


    logOut(): void {
        //delete the user data from user service
        this.userService.clearUserModel();
        //close web socket
        this.messageService.endWebSocket();
        //jump to home page
        this.router.navigate(['/home']);
    }


    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
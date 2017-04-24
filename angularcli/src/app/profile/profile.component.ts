/**
 * Created by hlz on 17-2-19.
 */
import {Component, OnInit, OnDestroy} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import {UserService} from '../core/user.service';
import {ApiHttpService} from '../share/api-http.service';
import {ApiRoutesService} from '../share/api-routes.service';
import {MessageService} from '../message/message.service';
import {languages} from '../lang/lang-available';
import {User} from '../core/user';

@Component({
               selector   : 'profile',
               templateUrl: './html/profile.component.html',
               styleUrls  : ['./scss/profile.component.scss']
           })
export class ProfileComponent implements OnInit, OnDestroy {

    private subscription: Subscription;

    private user = this.userService.getUserModel();

    public languages = languages;

    constructor(
        private router: Router,
        private userService: UserService,
        private apiHttpService: ApiHttpService,
        private apiRoutesService: ApiRoutesService,
        private messageService: MessageService,
    ) {
    }


    ngOnInit() {
        this.subscription = this.userService.userModel$.subscribe(
            (userModel: User) => this.user = userModel
        );
    }


    ngOnDestroy() {
        setTimeout(() => {
            this.subscription.unsubscribe();
        });
    }

    /**
     * choose local file
     */
    chooseFile(): void {
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
            response => this.messageService.handleResponse(response, () => {
                this.userService.setUserProperties(response);
                this.messageService.showFlashMessage('message.user_profile_updated');
            })
        );
    }

    /**
     * log out
     */
    logOut(): void {
        //delete the user data from user service
        this.userService.clearUserModel();
        //close web socket
        this.messageService.endWebSocket();
        //jump to home page
        this.router.navigate(['/home']);
    }


}
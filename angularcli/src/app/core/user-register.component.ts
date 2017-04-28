/**
 * Created by hlz on 17-2-23.
 */
import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {ApiRoutesService} from '../share/api-routes.service';
import {ApiHttpService} from "../share/api-http.service";
import {UserService} from './user.service';

@Component({
               selector   : 'user-register',
               templateUrl: './html/user-register.component.html',
               styleUrls  : ['./scss/user-register.component.scss']
           })
export class UserRegisterComponent {

    constructor(
        private router: Router,
        private apiRoutesService: ApiRoutesService,
        private apiHttpService: ApiHttpService,
        private userService: UserService,
    ) {

    }

    //
    public registerModel                   = {
        email           : '',
        password        : '',
        confirm_password: '',
        name            : ''
    };
    //
    public invalidEmail: boolean           = false;
    //
    public invalidConfirmPassword: boolean = false;
    //
    public serverError: boolean            = false;
    //
    private serverErrorMessage: string     = '';

    //检查邮箱有效性
    checkEmail() {
        this.invalidEmail = !this.userService.emailPattern.test(this.registerModel.email);
    }
    //重复输入密码
    confirmPassword() {
        this.invalidConfirmPassword = this.registerModel.password !== this.registerModel.confirm_password;
    }

    /**
     * 注册
     */
    onSubmit() {
        let formData = new FormData();

        formData.append('email', this.registerModel.email);
        formData.append('password', this.registerModel.password);
        formData.append('password_confirmation', this.registerModel.confirm_password);
        formData.append('name', this.registerModel.name);

        this.apiHttpService.post(this.apiRoutesService.register, formData).subscribe(
            response => {
                if (response.status == 500) {

                    this.serverError = true;

                    if (response.error) {
                        if (response.error instanceof Array) {
                            this.serverErrorMessage = response.error[0];
                        } else if (response.error instanceof String) {
                            this.serverErrorMessage = response.error;
                        }
                    }

                } else {

                    this.serverError = true;

                    this.userService.setUserProperties({
                                                           access_token : response.access_token,
                                                           refresh_token: response.refresh_token,
                                                       });

                    if (this.userService.getUserProperty('access_token')) {
                        this.userService.saveLocalAccessToken(this.userService.getUserProperty('access_token'));

                        this.apiHttpService.get(this.apiRoutesService.user).subscribe(
                            response => {
                                this.userService.saveUserModel(response);
                                this.router.navigate(['/home']);
                            }
                        );
                    }

                }
            }
        )

    }


    // gitLogin() {
    //     this.apiHttpService.get(this.apiRoutesService.gitLogin).subscribe(
    //         response => {
    //             console.log(response);
    //         }
    //     )
    // }

}
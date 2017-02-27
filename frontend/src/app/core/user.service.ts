/**
 * Created by hlz on 16-10-11.
 */
import {Injectable} from '@angular/core';
import {User} from './user';
import {OriginUserData} from './origin-user-data';
import {Subject}    from 'rxjs/Subject';

import {StorageService} from '../share/storage.service';

export class UserServiceConfig {
    userName = 'Anonymous';
}

@Injectable()
export class UserService {

    constructor(
        private storageService: StorageService
    ) {

    }

    private userModel = new User();


    private userModelSource = new Subject<User>();


    public userModel$ = this.userModelSource.asObservable();


    public emailPattern = /@([a-zA-Z0-9\-])+\./;


    sealUserModel(): void {
        Object.seal(this.userModel);
    }


    getUserModel(): User {
        return this.userModel;
    }


    clearUserModel(): void {
        this.userModel = new User();
        this.storageService.setItem('access_token', null);
        this.userModelSource.next(this.userModel);
    }


    getUserProperty(userProperty): string {
        return this.userModel[userProperty];
    }


    setUserProperties(...userProperty: Object[]): void {
        Object.assign(this.userModel, ...userProperty);
        this.userModelSource.next(this.userModel);
    }


    saveUserModel(response: OriginUserData) {
        let profile = response.profile;
        delete response.profile;

        this.setUserProperties(response, profile);

        if (this.userModel.portrait) {
            this.userModel.thumb = this.userModel.portrait.replace(/(\.\w+)$/, function(match, p1){
                return '-t' + p1;
            })
        }

        this.sealUserModel();

        this.userModelSource.next(this.userModel);
    }


    saveLocalAccessToken(access_token: string) {
        this.storageService.setItem('access_token', access_token);
    }


    getLocalAccessToken() {
        return this.storageService.getItem('access_token');
    }


}

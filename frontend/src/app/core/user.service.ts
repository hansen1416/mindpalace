/**
 * Created by mok on 16-10-11.
 */
import {Injectable} from '@angular/core';
import {User} from './user';

import {StorageService} from '../share/storage.service';

export class UserServiceConfig {
    userName = 'Anonymous';
}

@Injectable()
export class UserService {


    private userModel = new User();


    constructor(
        private storageService: StorageService
    ) {}


    sealUserModel(): void {
        Object.seal(this.userModel);
    }


    getUserModel(): User {
        return this.storageService.getItem<User>('userModel') || this.userModel;
    }


    getUserProperty(userProperty): string {
        let userModel = this.getUserModel();
        return userModel[userProperty];
    }


    setUserProperties(...userProperty: Object[]): void {
        Object.assign(this.userModel, ...userProperty);
        this.storageService.setItem('userModel', this.userModel);
    }


}
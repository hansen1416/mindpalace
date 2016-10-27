/**
 * Created by mok on 16-10-11.
 */
import {Injectable} from '@angular/core';
import {User} from './user';


export class UserServiceConfig {
    userName = 'Anonymous';
}

@Injectable()
export class UserService {


    private userModel = new User();


    constructor() {}


    sealUserModel(): void {
        Object.seal(this.userModel);
    }

    
    getUserModel(): User {
        return this.userModel;
    }


    getUserProperty(userProperty): string {
        return this.userModel[userProperty];
    }


    setUserProperties(...userProperty: Object[]): void {
        Object.assign(this.userModel, ...userProperty);
    }


}
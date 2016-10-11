/**
 * Created by mok on 16-10-11.
 */
import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {User} from './user';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserService {

    constructor(private http: Http) {

    }

    private authUrl = "http://api.mindpalaces.com/api/login";

    private handleError(error: any): Promise<any> {
        console.log(this.authUrl, error);
        return Promise.reject(error.message || error);
    }

    authenticate(): Promise<User> {
        return this.http.post(this.authUrl, JSON.stringify({email: 'hansen1416@163.com', password: 123456}))
                   .toPromise()
                   .then(response=> response.json().data as User)
                   .catch(this.handleError);
    }

}
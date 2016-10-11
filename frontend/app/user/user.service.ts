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

    private authUrl = "http://api.mindpalaces.com/api/home";

    authenticate(): Promise<User> {
        return this.http.get(this.authUrl)
                   .toPromise()
                   .then(response=> {
                       // user = response;
                       console.log(response);
                       return User;
                   });
    }

}
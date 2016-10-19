/**
 * Created by mok on 16-10-11.
 */
import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {User} from './user';

import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


export class UserServiceConfig {
    userName = 'Anonymous';
}

@Injectable()
export class UserService {


    private userModel = new User();


    constructor(
        private http: Http,
    ) {}


    getUserModel() {
        return this.userModel;
    }


    getUserProperty(userProperty): string {
        return this.userModel[userProperty];
    }


    setUserProperty(userProperty:Object): void {
        Object.assign(this.userModel, userProperty);
    }


    authenticate(url: string): Observable<User> {

        let formData = new FormData();

        formData.append('email', this.getUserModel().email);
        formData.append('password', this.getUserModel().password);

        return this.http.post(url, formData)
                   .map((res: Response) => res.json() as User)
                   .catch((error: any) => Observable.throw(error.json() || 'Server error'));
    }


    ctg(user: User): Observable<any> {

        let url     = "http://api.mindpalaces.com/api/ctg";
        let headers = new Headers({
            //set Accept to 'application/json', so at the server side $request->expectsJson() will true
            'Accept'       : 'application/json',
            //the Bearer credential
            'Authorization': 'Bearer ' + user.access_token
        });
        let options = new RequestOptions({headers: headers});

        return this.http.get(url, options)
                   .map((res: Response) => res.json())
                   .catch((error: any) => Observable.throw(error.json() || 'Server error'));
    }

}
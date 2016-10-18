/**
 * Created by mok on 16-10-11.
 */
import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {User} from './user';

import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


export class UserServiceConfig {
    userName = 'Philip Marlowe';
}

@Injectable()
export class UserService {

    private authUrl = "http://api.mindpalaces.com/api/login";

    public userModel = new User(0, '', '', '');

    constructor(
        private http: Http,
    ) {

    }


    authenticate(): Observable<User> {

        let body = new FormData();

        body.append('email', 'hansen1416@163.com');
        body.append('password', 'hs198546');

        return this.http.post(this.authUrl, body)
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


    getUserModel() {
        return this.userModel;
    }

    serUserLanguage(lang:string):void {
        this.userModel.userLanguage = lang;
    }


    getUserLanguage() {
        return this.userModel.userLanguage;
    }

}
/**
 * Created by mok on 16-10-11.
 */
import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {User} from './user';

import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class UserService {

    constructor(private http: Http) {

    }

    private authUrl = "http://api.mindpalaces.com/api/login";

    private handleError(error: any): Promise<any> {
        console.log(this.authUrl, error);
        return Promise.reject(error.message || error);
    }

    authenticate(): Observable<User> {

        let body    = new FormData();
        // let headers = new Headers({'Content-Type': 'multipart/form-data; charset=utf-8; boundary=----WebKitFormBoundarypda2sdkj'});
        // let options = new RequestOptions({headers: headers});

        body.append('email', 'hansen1416@163.com');
        body.append('password', '123456');

        return this.http.post(this.authUrl, body)
                   .map((res: Response) => res.json())
                   .catch((error: any) => Observable.throw(error.json() || 'Server error'));
    }

}
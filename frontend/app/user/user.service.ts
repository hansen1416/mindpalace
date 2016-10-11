/**
 * Created by mok on 16-10-11.
 */
import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {User} from './user';

import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class UserService {

    constructor(private http: Http) {

    }

    private authUrl = "http://api.mindpalaces.com/api/login";


    authenticate(): Observable<User> {

        let body = new FormData();

        body.append('email', 'hansen1416@163.com');
        body.append('password', 'hs198546');

        return this.http.post(this.authUrl, body)
            .map((res: Response) => res.json() as User)
            .catch((error: any) => Observable.throw(error.json() || 'Server error'));
    }


    ctg(): Observable<any> {

        let url = "http://api.mindpalaces.com/api/ctg";

        return this.http.get(url)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json() || 'Server error'));
    }

}
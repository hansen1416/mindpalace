/**
 * Created by hlz on 16-10-20.
 */
import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {UserService} from "../core/user.service";

import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ApiHttpService {


    constructor(
        private http: Http,
        private userService: UserService,
    ) {
        this.http        = http;
        this.userService = userService;
    }


    private createOptions() {

        let headers = new Headers({
            //set Accept to 'application/json', so at the server side $request->expectsJson() will true
            'Accept':        'application/json',
            //the Bearer credential
            'Authorization': 'Bearer ' + this.userService.getUserProperty('access_token')
        });
        return new RequestOptions({headers: headers});
    }


    get(url) : Observable<any> {

        return this.http.get(url, this.createOptions())
                   .map((res: Response) => res.json())
                   .catch((error: any) => Observable.throw(error.json() || 'Server error'));
    }


    post(url, data:FormData) : Observable<any> {

        return this.http.post(url, data, this.createOptions())
                   .map((res: Response) => res.json())
                   .catch((error: any) => Observable.throw(error.json() || 'Server error'));
    }

}
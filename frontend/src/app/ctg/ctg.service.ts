/**
 * Created by mok on 16-11-18.
 */
import {Injectable} from '@angular/core';

import {ApiHttpService} from '../share/api-http.service';
import {ApiRoutesService} from '../share/api-routes.service';
import {Ctg} from './ctg';
import {Observable} from "rxjs";

@Injectable()
export class CtgService {


    constructor(
        private http: ApiHttpService,
        private routers: ApiRoutesService
    ) {}


    getCtgListBySpaceId(space_id:number):Observable<Ctg[]> {
        return this.http.get(this.routers.space(space_id));
    }

}
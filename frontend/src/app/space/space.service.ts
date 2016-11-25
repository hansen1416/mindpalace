/**
 * Created by mok on 16-11-23.
 */
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";

import {ApiRoutesService} from '../share/api-routes.service';
import {ApiHttpService} from '../share/api-http.service';
import {Space} from './space';

@Injectable()
export class SpaceService {


    constructor(
        private apiRoutes: ApiRoutesService,
        private apiHttp: ApiHttpService,
    ) {}


    getHomeSpaceList(): Observable<Space[]> {
        return this.apiHttp.get(this.apiRoutes.home);
    }
}
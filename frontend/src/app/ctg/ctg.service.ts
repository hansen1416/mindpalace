/**
 * Created by mok on 16-11-18.
 */
import {Injectable} from '@angular/core';

import {ApiHttpService} from '../share/api-http.service';

@Injectable()
export class CtgService {

    ctgList: Object[];
    
    private apiHttp;

    constructor(
        private http:ApiHttpService
    ) {
        this.apiHttp = http;
    }

    getCtgListBySpaceId(space_id:number) {

    }


}
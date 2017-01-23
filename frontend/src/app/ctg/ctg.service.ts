/**
 * Created by mok on 16-11-18.
 */
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";

import {ApiHttpService} from '../share/api-http.service';
import {ApiRoutesService} from '../share/api-routes.service';
import {Ctg} from './ctg';

class GoBack {
    url: string;
    name: string;
}

@Injectable()
export class CtgService {


    private spaceId: number;


    private ctgId: number;


    private ctgList: Ctg[];


    private goBack: GoBack = {url: '/', name: '首页'};


    constructor(
        private http: ApiHttpService,
        private routers: ApiRoutesService
    ) {}


    set setSpaceId(spaceId: number) {
        this.spaceId = spaceId;
    }


    get getSpaceId() {
        return this.spaceId;
    }


    set setCtgId(ctg_id: number) {
        this.ctgId = ctg_id;
    }


    get getCtgId() {
        return this.ctgId;
    }


    set setCtgList(ctgList: Ctg[]) {
        this.ctgList = ctgList;
    }


    get getCtgList() {
        return this.ctgList;
    }


    get getGoBack() {
        return this.goBack;
    }


    set setGoBack(object: GoBack) {
        this.goBack = object;
    }


    getCtgListBySpaceIdCtgId(): Observable<Ctg[]> {
        return this.http.get(this.routers.ctgList(this.getSpaceId, this.getCtgId));
    }


}



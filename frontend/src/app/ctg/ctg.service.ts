/**
 * Created by mok on 16-11-18.
 */
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";

import {ApiHttpService} from '../share/api-http.service';
import {ApiRoutesService} from '../share/api-routes.service';
import {Ctg} from './ctg';
import {CtgPosition} from './ctg-position';

@Injectable()
export class CtgService {


    private spaceId: number;


    private ctgId: number;


    private ctgList: Ctg[];


    private ctgPositions = <Array<CtgPosition>>[];


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


    get getCtgPositions() {
        return this.ctgPositions;
    }

    getCtgListBySpaceId(): Observable<Ctg[]> {
        return this.http.get(this.routers.space(this.getSpaceId));
    }


    getCtgListByCtgId(): Observable<Ctg[]> {
        return this.http.get(this.routers.ctg(this.getCtgId));
    }


}
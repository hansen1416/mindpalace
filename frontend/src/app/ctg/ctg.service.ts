/**
 * Created by hlz on 16-11-18.
 */
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Subject} from 'rxjs/Subject';

import {ApiHttpService} from '../share/api-http.service';
import {ApiRoutesService} from '../share/api-routes.service';
import {Ctg, MousePosition} from './ctg';


@Injectable()
export class CtgService {

    //页面的 space_id
    private spaceId: number;
    //页面的 ctg_id
    private ctgId: number;
    //ctg list 数据
    private ctgList: Ctg[];
    //之前访问的所有 ctg 的数据，按照时间顺序排列
    private previous              = <Array<string>>[];
    //previous subject
    private previousSource        = new Subject<Array<string>>();
    //previous observable
    public previous$              = this.previousSource.asObservable();
    //编辑器
    public simpleMDE: any;
    //当前选中的 ctg
    private ctg: Ctg;
    //control position
    public controlPosition: MousePosition;
    //control position subject
    private controlPositionSource = new Subject<MousePosition>();
    //control position observable
    public controlPosition$       = this.controlPositionSource.asObservable();

    constructor(
        private apiHttpService: ApiHttpService,
        private apiRoutesService: ApiRoutesService
    ) {
    }


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


    set addPrevious(title: string) {
        this.previous.unshift(title);
        this.previousSource.next(this.previous);
    }


    shiftPrevious(): void {
        if (this.previous.length) {
            this.previous.shift();
            this.previousSource.next(this.previous);
        }
    }

    //获取 ctg 列表数据
    getCtgListBySpaceIdCtgId(): Observable<Ctg[]> {
        return this.apiHttpService.get(this.apiRoutesService.ctgList(this.getSpaceId, this.getCtgId));
    }


    set setCtg(ctg: Ctg) {
        this.ctg = ctg;
    }


    get getCtg() {
        return this.ctg;
    }

    //set current control panel position
    setControlPosition(pos: MousePosition) {
        this.controlPosition = pos;
        this.controlPositionSource.next(this.controlPosition);
    }

}



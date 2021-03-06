/**
 * Created by hlz on 16-11-18.
 */
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Subject} from 'rxjs/Subject';

import {ApiHttpService} from '../share/api-http.service';
import {ApiRoutesService} from '../share/api-routes.service';
import {Ctg} from './ctg';
import {Position} from '../share/coordinates';

@Injectable()
export class CtgService {

    //页面的 space_id
    private spaceId: number;
    //页面的 ctg_id
    private ctgId: number;
    //当前选中的 ctg
    public ctg: Ctg;
    //
    private ctgSource             = new Subject<Ctg>();
    //
    public ctg$                   = this.ctgSource.asObservable();
    //control position
    public controlPosition: Position;
    //control position subject
    private controlPositionSource = new Subject<Position>();
    //control position observable
    public controlPosition$       = this.controlPositionSource.asObservable();
    //ctg content
    public ctgContent: string     = '';
    //ctg content Subject
    private ctgContentSource      = new Subject<string>();
    //ctg content observable
    public ctgContent$            = this.ctgContentSource.asObservable();
    //
    private spaceNameSource       = new Subject<string>();
    //
    public spaceName$             = this.spaceNameSource.asObservable();

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

    //获取 ctg 列表数据
    getCtgListBySpaceIdCtgId(): Observable<Ctg[]> {
        return this.apiHttpService.get(this.apiRoutesService.ctgList(this.getSpaceId, this.getCtgId));
    }


    setCtg(ctg: Ctg) {
        this.ctg = ctg;
        this.ctgSource.next(ctg);
    }


    //set current control panel position
    setControlPosition(pos: Position) {
        this.controlPosition = pos;
        this.controlPositionSource.next(this.controlPosition);
    }

    //set ctg content
    setCtgContent(content: string) {
        this.ctgContent = content;
        this.ctgContentSource.next(content);
    }

    //when change root ctg, change space name too
    setSpaceName(name: string) {
        this.spaceNameSource.next(name);
    }

}



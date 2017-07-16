/**
 * Created by hlz on 16-11-23.
 */
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Subject} from 'rxjs/Subject';

import {ApiRoutesService} from '../share/api-routes.service';
import {ApiHttpService} from '../share/api-http.service';
import {ConcentricService} from './concentric.service';
import {UserService} from '../core/user.service';
import {Space} from './space';
import {Position} from '../share/coordinates';

@Injectable()
export class SpaceService {
    //首页空间列表
    public spaces: Space[];
    //
    private spacesSource         = new Subject<Space[]>();
    //
    public spaces$               = this.spacesSource.asObservable();
    //首页空间布局位置
    public spacePositions        = <Position[]>[];
    //
    private spacePositionsSource = new Subject<Position[]>();
    //
    public spacePositions$       = this.spacePositionsSource.asObservable();
    //
    public mySpaces: Space[];
    //
    private mySpacesSource       = new Subject<Space[]>();
    //
    public mySpaces$             = this.mySpacesSource.asObservable();

    constructor(
        private apiRoutes: ApiRoutesService,
        private apiHttp: ApiHttpService,
        private concentricService: ConcentricService,
        private userService: UserService,
    ) {
    }

    /**
     * get home space list
     * @returns {Observable<any>}
     */
    getHomeSpaceList(): Observable<Space[]> {
        return this.apiHttp.get(this.apiRoutes.home);
    }

    /**
     * get home list, searched bt space name
     * @param spaceName
     * @returns {Observable<any>}
     */
    getSearchSpaceList(spaceName: string): Observable<Space[]> {
        let data = new FormData();
        data.append('name', spaceName);
        return this.apiHttp.post(this.apiRoutes.searchSpace, data);
    }

    /**
     * set the shared space list data across the app
     * @param spaces
     */
    setSpaces(spaces?: Space[]) {
        this.spacePositions = this.concentricService.setConcentricCircles(spaces.length, {a: 25, b: 18, k: 5, g: 3});
        this.spacePositionsSource.next(this.spacePositions);

        if (spaces) {
            this.spaces = spaces;
            this.spacesSource.next(this.spaces);
        }
    }

    /**
     * 添加一个空的空间，用于新增空间
     */
    addEmptySpace() {
        this.spaces.unshift(new Space());
        this.spacesSource.next(this.spaces);
        this.setSpaces(this.spaces);
    }

    /**
     * 添加新空间操作
     * @param space
     */
    addNewSpace(space: Space) {
        this.spaces[0] = space;
        this.addEmptySpace();
    }

    /**
     * get user's space list
     */
    getMySpaces(): void {
        let user_id = this.userService.getUserProperty('user_id');

        if (!user_id) {
            this.mySpacesSource.next([]);
        }

        if (this.mySpaces) {
            return;
        }

        this.apiHttp.get(this.apiRoutes.userSpaces).subscribe(
            (response: Space[]) => {
                this.mySpacesSource.next(response);
            }
        );

    }

}
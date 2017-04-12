/**
 * Created by hlz on 16-11-23.
 */
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Subject} from 'rxjs/Subject';

import {ApiRoutesService} from '../share/api-routes.service';
import {ApiHttpService} from '../share/api-http.service';
import {ConcentricService} from './concentric.service';
import {Space} from './space';
import {Position} from './position';

@Injectable()
export class SpaceService {

    public spaces: Space[];

    private spacesSource = new Subject<Space[]>();

    public spaces$ = this.spacesSource.asObservable();

    public spacePositions = <Position[]>[];

    private spacePositionsSource = new Subject<Position[]>();

    public spacePositions$ = this.spacePositionsSource.asObservable();

    constructor(
        private apiRoutes: ApiRoutesService,
        private apiHttp: ApiHttpService,
        private concentricService: ConcentricService,
    ) {
    }


    getHomeSpaceList(): Observable<Space[]> {
        return this.apiHttp.get(this.apiRoutes.home);
    }


    getSearchSpaceList(spaceName: string): Observable<Space[]> {
        let data = new FormData();
        data.append('name', spaceName);
        return this.apiHttp.post(this.apiRoutes.searchSpace, data);
    }


    setSpaces(spaces?: Space[]) {
        this.spacePositions = this.concentricService.setConcentricCircles(spaces.length, {a: 25, b: 18, k: 5, g: 3});
        this.spacePositionsSource.next(this.spacePositions);

        if (spaces) {
            this.spaces = spaces;
            this.spacesSource.next(this.spaces);
        }
    }


    addEmptySpace() {
        this.spaces.unshift(new Space());
        this.spacesSource.next(this.spaces);
        this.setSpaces(this.spaces);
    }


    addNewSpace(space: Space) {
        this.spaces[0] = space;
        this.addEmptySpace();
    }

}
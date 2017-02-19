/**
 * Created by hlz on 16-11-23.
 */
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";

import {ApiRoutesService} from '../share/api-routes.service';
import {ApiHttpService} from '../share/api-http.service';
import {ConcentricService} from './concentric.service';
import {Space} from './space';

@Injectable()
export class SpaceService {

    private spaces: Space[];

    constructor(
        private apiRoutes: ApiRoutesService,
        private apiHttp: ApiHttpService,
        private concentricService: ConcentricService,
    ) {}


    getHomeSpaceList(): Observable<Space[]> {
        return this.apiHttp.get(this.apiRoutes.home);
    }


    getSearchSpaceList(spaceName:string): Observable<Space[]> {
        let data = new FormData();
        data.append('name', spaceName);
        return this.apiHttp.post(this.apiRoutes.searchSpace, data);
    }


    get getSpaces() {
        return this.spaces;
    }


    set setSpaces(spaces: Space[]) {
        this.spaces = spaces;
    }


    addEmptySpace() {
        this.spaces.unshift(new Space());
        this.concentricService.setConcentricCircles(this.getSpaces);
    }


    addNewSpace(space:Space) {
        this.spaces[0] = space;
        this.addEmptySpace();
    }

}
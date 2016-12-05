/**
 * Created by mok on 16-11-8.
 */
import {Component, OnInit} from '@angular/core';

import {SpaceService} from './space.service';
import {ConcentricService} from './concentric.service';
import {CssService} from '../share/css.service';
import {ApiRoutesService} from '../share/api-routes.service';
import {ApiHttpService} from '../share/api-http.service';
import {Space} from './space';
import {Position} from './position';


@Component({
               selector   : 'space-home',
               templateUrl: './html/space-home.component.html',
               styles     : [require('./scss/space-home.component.scss')]
           })
export class SpaceHomeComponent implements OnInit {

    //spaces on the home page
    private spaces: Space[];

    //position of all the spaces
    private positions: Array<Position>;


    constructor(
        private spaceService: SpaceService,
        private concentricService: ConcentricService,
        private cssService: CssService,
        private apiRoutes: ApiRoutesService,
        private apiHttp: ApiHttpService
    ) {
    }

    ngOnInit() {
        if (this.spaceService.getSpaces && this.concentricService.getPositions) {
            this.spaces    = this.spaceService.getSpaces;
            this.positions = this.concentricService.getPositions;
        } else {
            /**
             * get the spaces data from api
             * set the position for each space item
             */
            this.spaceService.getHomeSpaceList().subscribe(response => {
                this.spaces = this.spaceService.setSpaces = this.concentricService.setConcentricCircles(response);
                this.positions = this.concentricService.getPositions;
            });
        }
    }


    trackBySpaces(index: number, space: Space) {return space.space_id}


    spaceStyles(x, y) {
        let styles = {};

        styles[this.cssService.getTransform] = 'translate3d(' + x + 'rem, ' + y + 'rem, 0rem)';

        return styles;
    }


    addNewSpace(value){

        this.apiHttp.get(this.apiRoutes.createSpace).subscribe(response=>{
           console.log(response);
        });
        // console.log(value);
    }


}
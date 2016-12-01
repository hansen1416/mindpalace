/**
 * Created by mok on 16-11-8.
 */
import {Component, OnInit} from '@angular/core';


import {SpaceService} from './space.service';
import {ConcentricService} from './concentric.service';
import {CssService} from '../share/css.service';

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


    private positions: Array<Position>;


    constructor(
        private spaceService: SpaceService,
        private concentric: ConcentricService,
        private cssService: CssService
    ) {
    }

    ngOnInit() {
        if (this.spaceService.getSpaces && this.concentric.getPositions) {
            this.spaces    = this.spaceService.getSpaces;
            this.positions = this.concentric.getPositions;
        } else {
            /**
             * get the spaces data from api
             * set the position for each space item
             */
            this.spaceService.getHomeSpaceList().subscribe(response => {
                this.spaces = this.spaceService.setSpaces = this.concentric.setConcentricCircles(response);
                this.positions = this.concentric.getPositions;
            });
        }
    }


    trackBySpaces(index: number, space: Space) {return space.space_id}


    spaceStyles(x, y) {
        let styles = {};

        styles[this.cssService.getTransform] = 'translate3d(' + x + 'rem, ' + y + 'rem, 0rem)';

        return styles;
    }


}
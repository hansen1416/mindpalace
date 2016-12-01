/**
 * Created by mok on 16-11-8.
 */
import {Component, OnInit} from '@angular/core';


import {SpaceService} from './space.service';
import {ConcentricService} from './concentric.service';
import {CssService} from '../share/css.service';

import {Space} from './space';

@Component({
               selector   : 'space-home',
               templateUrl: './html/space-home.component.html',
               styles     : [require('./scss/space-home.component.scss')]
           })
export class SpaceHomeComponent implements OnInit {

    //spaces on the home page
    private spaces: Space[];

    //true if the sphere been built, false if not
    private sphere = false;


    private positions = [];

    constructor(
        private spaceService: SpaceService,
        private concentric: ConcentricService,
        private cssService: CssService
    ) {
    }

    ngOnInit() {
        /**
         * get the spaces data from api
         * set the position for each space item
         */
        this.spaceService.getHomeSpaceList().subscribe(response => this.spaces = this.concentric.serConcentricCircles(response));
    }


    trackBySpaces(index: number, space: Space) {return space.space_id}


    spaceStyles(x, y) {
        let styles = {};

        styles[this.cssService.getTransform] = 'translate3d(' + x + 'rem, ' + y + 'rem, 0rem)';

        return styles;
    }


}
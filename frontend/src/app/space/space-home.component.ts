/**
 * Created by mok on 16-11-8.
 */
import {Component, OnInit} from '@angular/core';


import {SpaceService} from './space.service';
import {ConcentricService} from './concentric.service';

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

    constructor(
        private spaceService: SpaceService,
        private concentric: ConcentricService
    ) {
    }

    ngOnInit() {
        //require the spaces data from api
        this.spaceService.getHomeSpaceList().subscribe(response => this.spaces = response);
    }

    ngAfterViewChecked() {

        //build the sphere
        if (!this.sphere) {
            let items = document.body.querySelectorAll('.space-item');

            if (items.length) {
                this.concentric.serConcentricCircles(items.length);

                console.log(this.concentric.getPositions);
                
                this.sphere = true;
            }
            
        }
    }

}
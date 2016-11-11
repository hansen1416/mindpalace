/**
 * Created by mok on 16-11-8.
 */
import {Component, OnInit} from '@angular/core';

import {ApiRoutesService} from '../share/api-routes.service';
import {ApiHttpService} from '../share/api-http.service';
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
        private apiRoutes: ApiRoutesService,
        private apiHttp: ApiHttpService,
        private concentric: ConcentricService,
    ) {
    }

    ngOnInit() {
        //require the spaces data from api
        this.apiHttp.get(this.apiRoutes.home).subscribe(
            response => this.spaces = response
        )
    }

    ngAfterContentChecked(){

        //build the sphere
        if (!this.sphere) {
            this.sphere = this.concentric.serConcentricCircles('.space-item', 10, 1);
        }
    }

}
/**
 * Created by mok on 16-11-8.
 */
import {Component, OnInit} from '@angular/core';

import {ApiRoutesService} from '../share/api-routes.service';
import {ApiHttpService} from '../share/api-http.service';
import {SpiralService} from '../spiral/spiral.service';

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
        private spiral: SpiralService,
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
            this.sphere = this.spiral.setSphere('.space-item');
        }
    }

}
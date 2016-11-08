/**
 * Created by mok on 16-11-8.
 */
import {Component, OnInit} from '@angular/core';

import {ApiRoutesService} from '../share/api-routes.service';
import {ApiHttpService} from "../share/api-http.service";

import {Space} from './space';

@Component({
               selector   : 'space-home',
               templateUrl: './html/space-home.component.html',
               styles     : [require('./scss/space-home.component.scss')]
           })
export class SpaceHomeComponent implements OnInit {

    private spaces: Space[];

    constructor(
        private apiRoutes: ApiRoutesService,
        private apiHttp: ApiHttpService,
    ) {
    }

    ngOnInit() {
        this.apiHttp.get(this.apiRoutes.home).subscribe(
            response => {
                this.spaces = response;
                
                
                console.log(this.spaces);
            }
        )
    }

}
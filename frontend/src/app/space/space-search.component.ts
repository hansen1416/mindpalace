/**
 * Created by mok on 16-12-7.
 */
import {Component, OnInit} from '@angular/core';

import {ApiHttpService} from '../share/api-http.service';
import {ApiRoutesService} from '../share/api-routes.service';
import {SpaceService} from './space.service';
import {ConcentricService} from './concentric.service';
import {WebSpaceService} from './web-space.service';

@Component({
               selector   : 'space-search',
               templateUrl: './html/space-search.component.html',
               styles     : [require('./scss/space-search.component.scss')]
           })
export class SpaceSearchComponent implements OnInit {


    private spaceName = '';


    private searchInProgress = false;


    private searched = false;


    private worker: Worker;

    constructor(
        private apiHttpService: ApiHttpService,
        private apiRoutesService: ApiRoutesService,
        private spaceService: SpaceService,
        private concentricService: ConcentricService,
        private webSpaceService: WebSpaceService,
    ) {}

    ngOnInit() {

    }

    /**
     * search spaces by space name
     */
    searchSpace() {

        if (!this.spaceName) {
            return;
        }

        if (this.searchInProgress) {
            return;
        }

        this.searchInProgress = true;

        this.spaceService.getSearchSpaceList(this.spaceName).subscribe(response => {
            this.spaceService.setSpaces = this.concentricService.setConcentricCircles(response);

            this.searched         = true;
            this.searchInProgress = false;
        });
    }

    /**
     * show all user available spaces after search conducted
     */
    showAll() {
        if (this.searchInProgress) {
            return;
        }

        this.searchInProgress = true;

        this.spaceService.getHomeSpaceList().subscribe(response => {
            this.spaceService.setSpaces = this.concentricService.setConcentricCircles(response);

            this.searched         = false;
            this.searchInProgress = false;
        });
    }


    fetchUrl(url: string) {

        this.worker = new Worker('worker.js');

        this.worker.addEventListener('message', (e: MessageEvent) => {
            console.log(e);
        });

        this.worker.postMessage({url: url});
    }


}
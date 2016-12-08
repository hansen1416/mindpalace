/**
 * Created by mok on 16-12-7.
 */
import {Component} from '@angular/core';

import {SpaceService} from './space.service';
import {ConcentricService} from './concentric.service';

@Component({
               selector   : 'space-search',
               templateUrl: './html/space-search.component.html',
               styles     : [require('./scss/space-search.component.scss')]
           })
export class SpaceSearchComponent {


    private spaceName = '';


    private searchInProgress = false;


    private searched = false;

    constructor(
        private spaceService: SpaceService,
        private concentricService: ConcentricService
    ) {}

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


}
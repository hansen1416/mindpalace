/**
 * Created by mok on 16-12-7.
 */
import {Component} from '@angular/core';

import {SpaceService} from './space.service';

@Component({
               selector   : 'space-search',
               templateUrl: './html/space-search.component.html',
               styles     : [require('./scss/space-search.component.scss')]
           })
export class SpaceSearchComponent {


    private spaceName = '';


    private searchInProgress = false;

    constructor(
        private spaceService: SpaceService
    ) {

    }

    searchSpace() {

        if (!this.spaceName) {
            return;
        }

        if (this.searchInProgress) {
            return;
        }

        this.searchInProgress = true;

        this.spaceService.getSearchSpaceList(this.spaceName).subscribe(response => {
            console.log(response);
            this.searchInProgress = false;
        });
    }

}
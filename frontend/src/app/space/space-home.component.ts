/**
 * Created by mok on 16-11-8.
 */
import {Component, OnInit} from '@angular/core';

import {SpaceService} from './space.service';
import {ConcentricService} from './concentric.service';
import {CssService} from '../share/css.service';
import {ApiRoutesService} from '../share/api-routes.service';
import {ApiHttpService} from '../share/api-http.service';
import {UserService} from '../core/user.service';
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


    private addInProgress = false;


    private newSpaceName = '';


    constructor(
        private spaceService: SpaceService,
        private concentricService: ConcentricService,
        private cssService: CssService,
        private apiRoutes: ApiRoutesService,
        private apiHttp: ApiHttpService,
        private userService: UserService,
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
                this.spaceService.setSpaces = this.concentricService.setConcentricCircles(response);

                if (this.userService.getUserProperty('access_token')) {
                    this.spaceService.addEmptySpace();
                }
            });
        }
    }

    /**
     * synchronous space and position data from service
     */
    ngDoCheck() {
        this.spaces    = this.spaceService.getSpaces;
        this.positions = this.concentricService.getPositions;
    }


    trackBySpaces(index: number, space: Space) {return space.space_id}


    spaceStyles(x: number, y: number) {
        let styles = {};

        styles[this.cssService.getTransform] = 'translate3d(' + x + 'rem, ' + y + 'rem, 0rem)';

        return styles;
    }

    /**
     * add a new space
     */
    addNewSpace() {

        if (!this.newSpaceName) {
            return;
        }

        if (this.addInProgress) {
            return;
        }

        this.addInProgress = true;

        let data = new FormData();

        data.append('name', this.newSpaceName);

        this.apiHttp.post(this.apiRoutes.createSpace, data).subscribe(response=> {
            this.spaceService.addNewSpace(<Space>response[1]);
            this.newSpaceName  = '';
            this.addInProgress = false;
        });
    }


}
/**
 * Created by hlz on 16-11-8.
 */
import {Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {SpaceService} from './space.service';
import {CssService} from '../share/css.service';
import {ApiRoutesService} from '../share/api-routes.service';
import {ApiHttpService} from '../share/api-http.service';
import {UserService} from '../core/user.service';
import {MessageService} from '../message/message.service';
import {Space} from './space';
import {Position} from '../share/coordinates';

@Component({
               selector:    'space-home',
               templateUrl: './html/space-home.component.html',
               styleUrls:   ['./scss/space-home.component.scss']
           })
export class SpaceHomeComponent implements OnInit, OnDestroy, AfterViewInit {

    //spaces on the home page
    public spaces: Space[];

    //position of all the spaces
    protected positions: Position[];


    private addInProgress = false;


    private newSpaceName = '';


    private subscriptionSpaces: Subscription;


    private subscriptionPositions: Subscription;


    constructor(
        private spaceService: SpaceService,
        private cssService: CssService,
        private apiRoutes: ApiRoutesService,
        private apiHttp: ApiHttpService,
        private userService: UserService,
        private messageService: MessageService,
    ) {

    }


    ngOnInit() {

        document.body.style.overflowY = 'auto';

        this.subscriptionSpaces = this.spaceService.spaces$.subscribe(
            spaces => this.spaces = spaces
        );

        this.subscriptionPositions = this.spaceService.spacePositions$.subscribe(
            positions => this.positions = positions
        );

        if (this.spaceService.spaces && this.spaceService.spacePositions) {
            this.spaces    = this.spaceService.spaces;
            this.positions = this.spaceService.spacePositions;
        } else {
            /**
             * get the spaces data from api
             * set the position for each space item
             */
            this.spaceService.getHomeSpaceList().subscribe(response => {
                this.spaceService.setSpaces(response);

                if (this.userService.getUserProperty('access_token')) {
                    this.spaceService.addEmptySpace();
                }
            });
        }
    }


    ngAfterViewInit() {

    }


    ngOnDestroy() {
        setTimeout(()=> {
            document.body.style.overflowY = 'hidden';
            this.subscriptionSpaces.unsubscribe();
            this.subscriptionPositions.unsubscribe();
        });
    }


    trackBySpaces(index: number, space: Space) {
        return space.space_id
    }


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

        this.apiHttp.post(this.apiRoutes.createSpace, data).subscribe(
            response => this.messageService.handleResponse(response, () => {
                this.spaceService.addNewSpace(<Space>response);
                this.newSpaceName  = '';
                this.addInProgress = false;
            })
        );
    }

}
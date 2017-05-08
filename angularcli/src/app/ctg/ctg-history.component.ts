/**
 * Created by hlz on 17-4-20.
 */
import {Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from "rxjs";

import {ApiRoutesService} from '../share/api-routes.service';
import {ApiHttpService} from '../share/api-http.service';
import {CtgService} from './ctg.service';
import {Space} from '../space/space';

// Define Editor Component
@Component({
               selector   : 'ctg-history',
               templateUrl: './html/ctg-history.component.html',
               styleUrls  : ['./scss/ctg-history.component.scss']
           })
export class CtgHistoryComponent implements OnInit, OnDestroy, AfterViewInit {
    //
    public space: Space;
    //
    private subscriptionSpaceName: Subscription;
    //
    private showEditSpace: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private apiRoutesService: ApiRoutesService,
        private apiHttpService: ApiHttpService,
        private ctgService: CtgService,
    ) {

    }


    ngOnInit() {
        let space_id = this.route.snapshot.params['space_id'];

        this.apiHttpService.get(this.apiRoutesService.space(space_id)).subscribe(
            (space: Space) => this.space = space
        );

        this.subscriptionSpaceName = this.ctgService.spaceName$.subscribe(
            (name: string) => this.space.name = name
        );
    }


    ngAfterViewInit() {

    }


    ngOnDestroy() {
        this.subscriptionSpaceName.unsubscribe();
    }

    /**
     *
     */
    toggleEdit(){
        // this.showEditSpace = !this.showEditSpace;
    }

}
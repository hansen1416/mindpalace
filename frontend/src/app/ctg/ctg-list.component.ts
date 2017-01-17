/**
 * Created by mok on 16-11-18.
 */
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import {CtgService} from './ctg.service';
import {ThreeEventService} from '../three/three-event.service';
import {Ctg} from "./ctg";

@Component({
               selector   : 'ctg-list',
               templateUrl: './html/ctg-list.component.html',
               styles     : [require('./scss/ctg-list.component.scss')]
           })
export class CtgListComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private ctgService: CtgService,
        private threeEventService: ThreeEventService
    ) {

    }


    private refreshCanvas = this.threeEventService.refreshCanvas;


    ngOnInit() {
        this.route.params.forEach((params: Params) => {

            this.ctgService.setSpaceId = params['space_id'];
            this.ctgService.setCtgId   = params['ctg_id'];
        });
    }


    ngAfterViewInit() {
        if (this.ctgService.getSpaceId && !this.ctgService.getCtgId) {
            this.ctgService.getCtgListBySpaceId().subscribe(response => this.renderCtgList(response));
        }

        if (this.ctgService.getSpaceId && this.ctgService.getCtgId) {
            this.ctgService.getCtgListByCtgId().subscribe(response => this.renderCtgList(response));
        }
    }


    ngAfterContentChecked() {
        // console.log(this.threeEventService.refreshCanvas);
    }
    

    private renderCtgList(ctgList: Ctg[]) {
        this.ctgService.setCtgList = ctgList;

        this.threeEventService.processData(this.ctgService.getCtgList);
        this.threeEventService.project();
    }


}
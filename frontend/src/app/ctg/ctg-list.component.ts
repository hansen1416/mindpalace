/**
 * Created by mok on 16-11-18.
 */
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import {CssService} from '../share/css.service';
import {CtgService} from './ctg.service';
import {Ctg} from "./ctg";
import {CtgPosition} from "./ctg-position";

@Component({
               selector   : 'ctg-list',
               templateUrl: './html/ctg-list.component.html',
               styles     : [require('./scss/ctg-list.component.scss')]
           })
export class CtgListComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private cssService: CssService,
        private ctgService: CtgService
    ) {

    }


    private ctgList: Ctg[];


    private ctgPositions: CtgPosition[];

    ngOnInit() {
        this.route.params.forEach((params: Params) => {

            this.ctgService.setSpaceId = params['space_id'];
            this.ctgService.setCtgId   = params['ctg_id'];

            if (this.ctgService.getSpaceId) {
                this.ctgService.getCtgListBySpaceId().subscribe(response => {
                    this.ctgService.setCtgList = this.ctgService.setCtgPosition(response);
                });
            }

            if (this.ctgService.getCtgId) {
                this.ctgService.getCtgListByCtgId().subscribe(response => {
                    this.ctgService.setCtgList = this.ctgService.setCtgPosition(response);
                });
            }

        });
    }


    ngDoCheck() {
        this.ctgList = this.ctgService.getCtgList;
        this.ctgPositions = this.ctgService.getCtgPositions;
    }


    ctgStyles(x: number, y: number, z: number) {
        let styles = {};

        styles[this.cssService.getTransform] = 'translate3d(' + x + 'rem, ' + y + 'rem, ' + z + 'rem)';

        return styles;
    }


}
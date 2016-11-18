/**
 * Created by mok on 16-11-18.
 */
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import {CtgService} from './ctg.service';


@Component({
               selector   : 'ctg-list',
               templateUrl: './html/ctg-list.component.html',
               styles     : [require('./scss/ctg-list.component.scss')]
           })
export class CtgListComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private service: CtgService
    ) {
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.service.getCtgListBySpaceId(params['space_id']);
        });
    }


}
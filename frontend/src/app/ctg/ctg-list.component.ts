/**
 * Created by mok on 16-11-18.
 */
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import {ApiHttpService} from '../share/api-http.service';
import {ApiRoutesService} from '../share/api-routes.service';
import {CtgService} from './ctg.service';
import {Ctg} from "./ctg";

@Component({
               selector   : 'ctg-list',
               templateUrl: './html/ctg-list.component.html',
               styles     : [require('./scss/ctg-list.component.scss')]
           })
export class CtgListComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private http: ApiHttpService,
        private routers: ApiRoutesService,
        private ctgService: CtgService
    ) {

    }


    ctgList:Ctg[];

    ngOnInit() {
        this.route.params.forEach((params: Params) => {

            this.http.get(this.routers.space(params['space_id'])).subscribe(
                response => {
                    this.ctgService.setCtgList(response);
                    this.ctgList = this.ctgService.getCtgList();
                }
            );
        });
    }


}
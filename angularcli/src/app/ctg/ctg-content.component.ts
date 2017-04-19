/**
 * Created by hlz on 17-1-28.
 */
// Angular Imports
import {Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {CtgService} from './ctg.service';
import {ApiRoutesService} from '../share/api-routes.service';
import {ApiHttpService} from '../share/api-http.service';
import {MessageService} from '../message/message.service';
import {Ctg} from './ctg';

// Define Editor Component
@Component({
               selector   : 'ctg-content',
               templateUrl: './html/ctg-content.component.html',
               styleUrls  : ['./scss/ctg-content.component.scss']
           })
export class CtgContentComponent implements OnInit, OnDestroy, AfterViewInit {

    public showSaveBtn: boolean = false;

    private subscriptionCtg: Subscription;

    private ctg: Ctg = this.ctgService.ctg;

    constructor(
        private ctgService: CtgService,
        private apiRouteService: ApiRoutesService,
        private apiHttpService: ApiHttpService,
        private messageService: MessageService,
    ) {
    }


    ngOnInit() {
        this.subscriptionCtg = this.ctgService.ctg$.subscribe(
            ctg => this.ctg = ctg
        );
    }


    ngAfterViewInit() {

    }


    ngOnDestroy() {
        this.subscriptionCtg.unsubscribe();
    }

    /**
     * content changed
     * show save button
     */
    contentChange() {
        this.showSaveBtn = true;
    }

    /**
     * when initialize the ctg content
     * hide the save button
     */
    contentInitial(){
        this.showSaveBtn = false;
    }

    /**
     * save button click event
     * save content
     * @param content
     */
    saveContent(content: string) {

        let data = new FormData();
        data.append('ctg_id', this.ctg.ctg_id);
        data.append('content', content);

        this.apiHttpService.post(this.apiRouteService.saveCtgContent, data).subscribe(
            response => this.messageService.handleResponse(response, 'ctg_content_updated')
        );
    }

}

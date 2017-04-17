/**
 * Created by hlz on 17-1-28.
 */
// Angular Imports
import {Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';

import {CtgService} from './ctg.service';
import {ApiRoutesService} from '../share/api-routes.service';
import {ApiHttpService} from '../share/api-http.service';
import {MessageService} from '../message/message.service';

// Define Editor Component
@Component({
               selector   : 'ctg-content',
               templateUrl: './html/ctg-content.component.html',
               styleUrls  : ['./scss/ctg-content.component.scss']
           })
export class CtgContentComponent implements OnInit, OnDestroy, AfterViewInit {

    private showSaveBtn: boolean = false;

    private ctgTitle: string = '';

    constructor(
        private ctgService: CtgService,
        private apiRouteService: ApiRoutesService,
        private apiHttpService: ApiHttpService,
        private messageService: MessageService,
    ) {
    }


    ngOnInit() {
        this.ctgTitle = this.ctgService.getCtg.ctg.title;
    }


    ngAfterViewInit() {

    }

    /**
     * content changed
     * show save button
     */
    contentChange() {
        this.showSaveBtn = true;
    }

    /**
     * save button click event
     * save content
     * @param content
     */
    saveContent(content: string) {

        let data = new FormData();
        data.append('ctg_id', this.ctgService.getCtg.ctg_id);
        data.append('content', content);

        this.apiHttpService.post(this.apiRouteService.saveCtgContent, data).subscribe(
            response => this.messageService.handleResponse(response, 'ctg_content_updated')
        );
    }


    ngOnDestroy() {

    }

}

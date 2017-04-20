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
import {SpaceService} from '../space/space.service';
import {Ctg} from './ctg';
import {Space} from '../space/space';

// Define Editor Component
@Component({
               selector   : 'ctg-content',
               templateUrl: './html/ctg-content.component.html',
               styleUrls  : ['./scss/ctg-content.component.scss']
           })
export class CtgContentComponent implements OnInit, OnDestroy, AfterViewInit {

    public showSaveBtn: boolean = false;

    public showSearchSpace: boolean = false;

    private subscriptionCtg: Subscription;

    private ctg: Ctg = this.ctgService.ctg;

    private searchInProgress = false;

    private spaceList = <Space[]>[];

    constructor(
        private ctgService: CtgService,
        private apiRouteService: ApiRoutesService,
        private apiHttpService: ApiHttpService,
        private messageService: MessageService,
        private spaceService: SpaceService,
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
    contentInitial() {
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

    searchUser() {

    }

    /**
     *
     */
    searchSpace() {
        this.showSearchSpace = true;
    }

    /**
     *
     * @param name
     */
    getSearchSpacesList(name: string) {
        if (!name) {
            return;
        }

        if (this.searchInProgress) {
            return;
        }

        this.searchInProgress = true;

        this.spaceService.getSearchSpaceList(name).subscribe(
            (response: Space[]) => {
                this.spaceList        = response;
                this.searchInProgress = false;
            }
        );
    }


    linkToSpace(space_id: number, name: string) {
        let data = new FormData();
        data.append('origin_space', this.ctg.space_id);
        data.append('ctg_id', this.ctg.ctg_id);
        data.append('space_id', space_id);

        this.apiHttpService.post(this.apiRouteService.linkCtg, data).subscribe(
            response => this.messageService.handleResponse(response, () => {
                this.messageService.showFlashMessage('message.link_ctg_to_space-' + this.ctg.ctg.title + '-' + name)
            })
        );
    }
}

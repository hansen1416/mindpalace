/**
 * Created by hlz on 17-1-28.
 */
// Angular Imports
import {Component, OnInit, OnDestroy, AfterViewInit, Output, EventEmitter} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {CtgService} from './ctg.service';
import {ApiRoutesService} from '../share/api-routes.service';
import {ApiHttpService} from '../share/api-http.service';
import {MessageService} from '../message/message.service';
import {SpaceService} from '../space/space.service';
import {UserService} from '../core/user.service';
import {Ctg} from './ctg';
import {Space} from '../space/space';

// Define Editor Component
@Component({
               selector:    'ctg-content',
               templateUrl: './html/ctg-content.component.html',
               styleUrls:   ['./scss/ctg-content.component.scss']
           })
export class CtgContentComponent implements OnInit, OnDestroy, AfterViewInit {
    //show save content button
    public showSaveBtn: boolean     = false;
    //the selected ctg
    public ctg: Ctg                 = this.ctgService.ctg;
    //ctg subscription
    private subscriptionCtg: Subscription;
    //click link ctg to space button, show space list search
    public showSearchSpace: boolean = false;
    //search space in progress
    private searchInProgress        = false;
    //the space list
    private spaceList               = <Space[]>[];
    //user info
    public user                     = this.userService.getUserModel();

    @Output() private ctgChange: EventEmitter<any> = new EventEmitter();

    constructor(
        private ctgService: CtgService,
        private apiRouteService: ApiRoutesService,
        private apiHttpService: ApiHttpService,
        private messageService: MessageService,
        private spaceService: SpaceService,
        private userService: UserService,
    ) {
    }


    ngOnInit() {

        this.subscriptionCtg = this.ctgService.ctg$.subscribe(
            ctg => this.ctg = ctg
        );
    }


    ngAfterViewInit() {
        let title  = document.querySelector(".ctg-title");
        let height = title.clientHeight;
        let max    = document.getElementById('maximize');

        max.style.width  = height + 'px';
        max.style.height = height + 'px';
    }


    ngOnDestroy() {
        this.spaceList = null;
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
     * maximize editor box
     * @param button
     * @param box
     */
    maximizeContent(button: HTMLElement, box: HTMLElement) {

        if (box.style.position != 'fixed') {
            box.style.position = 'fixed';
        } else {
            box.style.position = 'relative';
        }

        button.style.width  = box.clientHeight * 0.07 + 'px';
        button.style.height = box.clientHeight * 0.07 + 'px';
    }

    /**
     * save button click event
     * save content
     * @param title
     * @param content
     */
    saveContent(title: string, content: string) {
        let data = new FormData();
        data.append('space_id', this.ctg.space_id);
        data.append('ctg_id', this.ctg.ctg_id);
        data.append('title', title || this.ctg.ctg.title);
        data.append('content', content);

        this.apiHttpService.post(this.apiRouteService.saveCtgContent, data).subscribe(
            response => this.messageService.handleResponse(response, () => {
                this.messageService.showFlashMessage('message.ctg_content_updated');
                this.showSaveBtn = false;
                if (title != this.ctg.ctg.title) {
                    //rebuild the scene due to the ctg title change
                    this.ctgChange.emit();
                    //if change the root ctg, change the space name too
                    if (this.ctg.pid == 0) {
                        this.ctgService.setSpaceName(title);
                    }
                }
            })
        );
    }

    /**
     *
     */
    searchUser() {

    }

    /**
     *
     */
    searchSpace() {
        this.showSearchSpace = true;
    }

    /**
     * get space list from server
     * @param name
     */
    getSearchSpacesList(name: string): void {
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

    /**
     * link ctg to another space, can link multiple times
     * only link not copy, not editable in another space
     * @param space_id
     * @param name
     */
    linkToSpace(space_id: number, name: string): void {
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

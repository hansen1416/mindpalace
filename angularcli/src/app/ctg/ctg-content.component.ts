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
               selector   : 'ctg-content',
               templateUrl: './html/ctg-content.component.html',
               styleUrls  : ['./scss/ctg-content.component.scss']
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
    //
    private subscriptionSpaceList: Subscription;
    //user info
    public user                     = this.userService.getUserModel();
    //
    private clickedButton: string;
    //
    private subscriptionCtgContent: Subscription;
    //
    private ctgContent: String;

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

        this.subscriptionSpaceList = this.spaceService.mySpaces$.subscribe(
            (spaces: Space[]) => this.spaceList = spaces
        );

        this.subscriptionCtg = this.ctgService.ctg$.subscribe(
            ctg => this.ctg = ctg
        );

        this.subscriptionCtgContent = this.ctgService.ctgContent$.subscribe(
            (ctgContent: string) => this.ctgContent = ctgContent
        );
    }


    ngAfterViewInit() {
        let title  = document.querySelector(".ctg-title");
        let height = title.clientHeight;
        let max    = document.getElementById('maximize');

        max.style.width  = height + 'px';
        max.style.height = height + 'px';

        this.spaceService.getMySpaces();
    }


    ngOnDestroy() {
        this.spaceList = null;
        this.subscriptionCtg.unsubscribe();
        this.subscriptionSpaceList.unsubscribe();
        this.subscriptionCtgContent.unsubscribe();
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
     * @param button
     */
    searchSpace(button: string): void {
        if (this.clickedButton == button) {
            this.showSearchSpace = false;
            this.clickedButton   = null;
            return;
        }

        this.clickedButton   = button;
        this.showSearchSpace = true;
    }

    /**
     * space list style
     */
    spaceListPosition() {
        switch (this.clickedButton) {
            case 'link':
                return {'left': '33.3%'};
            case 'copy':
                return {'left': '66.6%'};
            default:
        }
    }

    /**
     * move \ link \copy ctg to user's another space
     * @param space_id
     * @param name
     */
    moveLinkCopy(space_id: number, name: string): void {

        if (this.searchInProgress) {
            this.messageService.showFlashMessage('action.handling');
            return;
        }

        this.searchInProgress = true;

        let data = new FormData();
        let url  = '';
        let msg  = '';

        data.append('origin_space', this.ctg.space_id);
        data.append('ctg_id', this.ctg.ctg_id);
        data.append('space_id', space_id);

        switch (this.clickedButton) {
            case 'move':
                url = this.apiRouteService.moveCtgTo;
                msg = 'move_ctg_to_space-' + this.ctg.ctg.title + '-' + name;
                break;
            case 'link':
                url = this.apiRouteService.linkCtgTo;
                msg = 'link_ctg_to_space-' + this.ctg.ctg.title + '-' + name;
                break;
            case 'copy':
                url = this.apiRouteService.copyCtgTo;
                msg = 'copy_ctg_to_space-' + this.ctg.ctg.title + '-' + name;
                break;
            default:
                return;
        }

        this.apiHttpService.post(url, data).subscribe(
            response => this.messageService.handleResponse(
                response,
                msg,
                () => {
                    this.searchInProgress = false;
                    //rebuild the scene due to the ctg move to another space
                    if (this.clickedButton == 'move') {
                        this.ctgChange.emit();
                    }
                }
            )
        );
    }

}

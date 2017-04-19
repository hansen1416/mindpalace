/**
 * Created by hlz on 17-3-29.
 */
import {Component, OnInit, OnDestroy, Output, ViewChild, EventEmitter} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import {CtgContentComponent} from './ctg-content.component';
import {ApiRoutesService} from '../share/api-routes.service';
import {ApiHttpService} from '../share/api-http.service';
import {MessageService} from '../message/message.service';
import {CtgService} from './ctg.service';
import {CssService} from '../share/css.service';
import {Ctg, MousePosition} from './ctg';

@Component({
               selector   : 'ctg-control',
               templateUrl: './html/ctg-control.component.html',
               styleUrls  : ['./scss/ctg-control.component.scss']
           })
export class CtgControlComponent implements OnInit, OnDestroy {

    //toggle the content editor
    public showContentBox: boolean  = false;
    //toggle the title input
    public showAddCtgInput: boolean = false;

    private field: number;

    private subscriptionCtg: Subscription;

    private ctg: Ctg = this.ctgService.ctg;

    private subscriptionControlPosition: Subscription;

    private controlPosition: MousePosition = this.ctgService.controlPosition;

    @Output() private ctgListChange: EventEmitter<any> = new EventEmitter();

    private showConfirm: boolean = false;

    private confirmContent: string = '';

    @ViewChild(CtgContentComponent) private ctgContentComponent: CtgContentComponent;

    constructor(
        protected location: Location,
        protected route: ActivatedRoute,
        protected router: Router,
        protected ctgService: CtgService,
        protected cssService: CssService,
        protected apiRoutesService: ApiRoutesService,
        protected apiHttpService: ApiHttpService,
        protected messageService: MessageService,
    ) {

    }


    ngOnInit() {

        this.subscriptionCtg = this.ctgService.ctg$.subscribe(
            ctg => this.ctg = ctg
        );

        this.subscriptionControlPosition = this.ctgService.controlPosition$.subscribe(
            controlPosition => this.controlPosition = controlPosition
        );

    }

    ngOnDestroy() {
        setTimeout(() => {
            this.subscriptionCtg.unsubscribe();
            this.subscriptionControlPosition.unsubscribe();
        });
    }

    /**
     * set three button positions
     * @param btn
     * @returns {{top: string, left: string}}
     */
    setBtnPosition(btn: string): {top: string, left: string} | void {

        let angle = this.calculateControlPosition();

        if (angle === undefined) {
            return;
        }

        switch (btn) {
            case 'view':
                angle++;
                break;
            case 'delete':
                angle += 2;
                break;
        }

        return {
            top : Math.sin(angle * 45 * Math.PI / 180) * 6.25 + 'rem',
            left: Math.cos(angle * 45 * Math.PI / 180) * 6.25 + 'rem'
        };
    }

    /**
     * calculate the control panel location
     * top side, top right corner, left side, ...
     * @returns {any}
     */
    protected calculateControlPosition(): number {
        let radius: number = 7 * this.cssService.remPx;

        //left side without bottom left corner
        if (this.controlPosition.x < radius && this.controlPosition.y < this.cssService.bh - radius) {
            //top left corner
            if (this.controlPosition.y < radius) {
                this.field = 0;
            } else {
                this.field = -1;
            }
            //top side without top left corner
        } else if (this.controlPosition.y < radius) {
            //top right corner
            if (this.controlPosition.x > this.cssService.bw - radius) {
                this.field = 2;
            } else {
                this.field = 1;
            }
            //right side without top right corner
        } else if (this.controlPosition.x > this.cssService.bw - radius) {
            //bottom right corner
            if (this.controlPosition.y > this.cssService.bh - radius) {
                this.field = 4;
            } else {
                this.field = 3;
            }
            //bottom side without bottom right corner
        } else if (this.controlPosition.y > this.cssService.bh - radius && this.controlPosition.x > radius) {
            this.field = 5;
            // bottom left corner and other place use the default style
        } else {
            return undefined;
        }

        return this.field;
    }

    /**
     * ctg control panel
     * view ctg content button click event
     */
    clickViewBtn(): void {
        //request the ctg content from server
        this.apiHttpService.get(this.apiRoutesService.ctgContent(this.ctg.ctg_id)).subscribe(
            response => this.messageService.handleResponse(response, () => {
                this.ctgService.setCtgContent(response.content ? response.content : '');
            })
        );
        //show content editor
        this.showContentBox  = true;
        //hide new ctg input
        this.showAddCtgInput = false;
        //hide save content button
        if (this.ctgContentComponent) {
            this.ctgContentComponent.showSaveBtn = false;
        }
    }

    /**
     * set editor position
     * @returns {{left: string}}
     */
    setEditorPosition() {
        if (this.controlPosition.x < this.cssService.bw / 2 - 6.25 * this.cssService.remPx) {
            return {
                left: '62%'
            }
        }
    }

    /**
     * ctg control panel
     * add new ctg button
     */
    clickAddBtn() {
        this.showAddCtgInput = true;
        this.showContentBox  = false;
    }

    /**
     * set new ctg input position
     * @returns {any}
     */
    spaceInputPosition(): {top: string, left: string, right: string} {
        let buttonWidth = 2.5;
        switch (this.field) {
            case -1:
            case 0:
            case 1:
                return {
                    top  : buttonWidth / 2 + 'rem',
                    left : buttonWidth / 2 + 'rem',
                    right: 'none'
                };
            case 2:
                return {
                    top  : buttonWidth * 2 + 'rem',
                    left : 'none',
                    right: '0'
                };
            default:
                return {
                    top  : buttonWidth / 2 + 'rem',
                    left : ' none',
                    right: buttonWidth * 1.5 + 'rem'
                }
        }
    }

    /**
     * add a new child ctg to selected ctg
     * @param title
     */
    addNewCtg(title: string) {

        if (!title) {
            return;
        }

        let data = new FormData();
        data.append('title', title);
        data.append('ctg_id', this.ctg.ctg_id);
        data.append('space_id', this.ctg.space_id);

        this.apiHttpService.post(this.apiRoutesService.createCtg, data).subscribe(
            response => this.messageService.handleResponse(response, () => {
                this.ctgListChange.emit();
            })
        );
    }

    /**
     * click delete button
     */
    clickDeleteBtn() {
        this.showConfirm    = true;
        this.confirmContent = 'message.confirm_delete_ctg';
    }

    /**
     * cancel delete
     */
    cancelDelete() {
        this.showConfirm = false;
    }

    /**
     * confirm delete
     */
    confirmDelete() {
        this.showConfirm = false;
        this.apiHttpService.get(this.apiRoutesService.ctgDelete(this.ctg.ctg_id)).subscribe(
            response => this.messageService.handleResponse(response, () => {
                this.messageService.showFlashMessage('message.delete_ctg-' + response.deleted);
                this.ctgListChange.emit();
            })
        )
    }

}
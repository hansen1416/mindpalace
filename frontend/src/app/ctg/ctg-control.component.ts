/**
 * Created by hlz on 17-3-29.
 */
import {Component, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {ApiRoutesService} from '../share/api-routes.service';
import {ApiHttpService} from '../share/api-http.service';
import {MessageService} from '../message/message.service';
import {CtgService} from './ctg.service';
import {CssService} from '../share/css.service';
import {MousePosition} from './ctg';

@Component({
               selector   : 'ctg-control',
               templateUrl: './html/ctg-control.component.html',
               styles     : [require('./scss/ctg-control.component.scss')]
           })
export class CtgControlComponent implements OnInit, OnDestroy {

    //hide the content editor
    private showContentBox: boolean  = false;
    //hide the title input
    private showAddCtgInput: boolean = false;

    private field: number;

    private subscriptionAddCtgInput: Subscription;

    private subscriptionControlPosition: Subscription;

    private controlPosition: MousePosition = this.ctgService.controlPosition;

    @Output()
    ctgListChange: EventEmitter<any> = new EventEmitter();

    private showConfirm: boolean = false;

    private confirmContent: string = '';

    constructor(
        private apiRoutesService: ApiRoutesService,
        private apiHttpService: ApiHttpService,
        private messageService: MessageService,
        private ctgService: CtgService,
        private cssService: CssService,
    ) {

    }


    ngOnInit() {
        this.subscriptionControlPosition = this.ctgService.controlPosition$.subscribe(
            controlPosition => this.controlPosition = controlPosition
        );

        this.subscriptionAddCtgInput = this.ctgService.showAddCtgInput$.subscribe(
            show => this.showAddCtgInput = show
        );
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
     * view ctg content button
     */
    clickViewBtn() {
        //request the ctg content from server
        this.apiHttpService.get(this.apiRoutesService.ctgContent(this.ctgService.getCtg.ctg_id)).subscribe(
            response => this.messageService.handleResponse(response, () => {
                this.ctgService.setCtgContent(response.content ? response.content : '');
            })
        );
        //show editor
        this.showContentBox = true;
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
        data.append('ctg_id', this.ctgService.getCtg.ctg_id);
        data.append('space_id', this.ctgService.getCtg.space_id);

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
        this.apiHttpService.get(this.apiRoutesService.ctgDelete(this.ctgService.getCtg.ctg_id)).subscribe(
            response => this.messageService.handleResponse(response, () => {
                this.messageService.showFlashMessage('message.delete_ctg-' + response.deleted);
                this.ctgListChange.emit();
            })
        )
    }


    ngOnDestroy() {
        this.subscriptionControlPosition.unsubscribe();
    }


}
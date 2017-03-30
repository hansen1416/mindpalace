/**
 * Created by hlz on 17-3-29.
 */
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {ApiRoutesService} from '../share/api-routes.service';
import {ApiHttpService} from '../share/api-http.service';
import {MessageService} from '../message/message.service';
import {CtgService} from './ctg.service';
import {CssService} from '../share/css.service';

@Component({
               selector   : 'ctg-control',
               templateUrl: './html/ctg-control.component.html',
               styles     : [require('./scss/ctg-control.component.scss')]
           })
export class CtgControlComponent implements OnInit, OnDestroy {

    //hide the content editor
    private showContentBox  = false;
    //hide the title input
    private showAddCtgInput = false;

    private subscription: Subscription;

    private controlPosition = this.ctgService.controlPosition;


    constructor(
        private apiRoutesService: ApiRoutesService,
        private apiHttpService: ApiHttpService,
        private messageService: MessageService,
        private ctgService: CtgService,
        private cssService: CssService,
    ) {

    }


    ngOnInit() {
        this.subscription = this.ctgService.controlPosition$.subscribe(
            controlPosition => {
                this.controlPosition = controlPosition;
            }
        );
    }

    /**
     * set three button positions
     * @param btn
     * @returns {{top: string, left: string}}
     */
    setBtnPosition(btn: string): {top: string, left: string} | void {
        let pos    = this.controlPosition;
        let radius = 7 * this.cssService.remPx;
        let angle  = 0;

        //left side without bottom left corner
        if (pos.x < radius && pos.y < this.cssService.bh - radius) {
            //top left corner
            if (pos.y < radius) {
                angle = 0;
            } else {
                angle = -1;
            }
            //top side without top left corner
        } else if (pos.y < radius) {
            //top right corner
            if (pos.x > this.cssService.bw - radius) {
                angle = 2;
            } else {
                angle = 1;
            }
            //right side without top right corner
        } else if (pos.x > this.cssService.bw - radius) {
            //bottom right corner
            if (pos.y > this.cssService.bh - radius) {
                angle = 4;
            } else {
                angle = 3;
            }
            //bottom side without bottom right corner
        } else if (pos.y > this.cssService.bh - radius && pos.x > radius) {
            angle = 5;
            // bottom left corner and other place use the default style
        } else {
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

    // /**
    //  * add a new child ctg to selected ctg
    //  * @param title
    //  */
    // addNewCtg(title: string) {
    //
    //     if (!title) {
    //         return;
    //     }
    //
    //     let data = new FormData();
    //     data.append('title', title);
    //     data.append('ctg_id', this.ctgService.getCtgId);
    //     data.append('space_id', this.ctgService.getSpaceId);
    //
    //     this.apiHttpService.post(this.apiRoutesService.createCtg, data).subscribe(
    //         response => {
    //             if (response.status && response.status == 500) {
    //                 this.messageService.show(response.error);
    //             } else {
    //                 this.rebuildScene();
    //
    //                 this.hideControls();
    //             }
    //         }
    //     );
    // }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }


}
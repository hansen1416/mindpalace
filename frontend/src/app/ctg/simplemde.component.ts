/**
 * Created by hlz on 17-1-28.
 */
// Angular Imports
import {Component, ElementRef, ViewChild, OnInit, OnDestroy} from '@angular/core';

import {CtgService} from './ctg.service';
import {ApiRoutesService} from '../share/api-routes.service';
import {ApiHttpService} from '../share/api-http.service';
import {MessageService} from '../message/message.service';
import {Subscription} from 'rxjs/Subscription';

// Declare Global Variable
let SimpleMDE: any = require('simplemde');

// Define Editor Component
@Component({
               selector   : 'mdeditor',
               templateUrl: './html/simplemde.component.html',
               styles     : [require('./scss/simplemde.component.scss')]
           })
export class SimplemdeComponent implements OnInit, OnDestroy {
    @ViewChild('simplemde') textarea: ElementRef;

    private showSaveBtn: boolean = false;

    private subscriptionCtgContent: Subscription;

    private simpleMDE: any;

    constructor(
        private elementRef: ElementRef,
        private ctgService: CtgService,
        private apiRouteService: ApiRoutesService,
        private apiHttpService: ApiHttpService,
        private messageService: MessageService,
    ) {
    }


    ngOnInit() {
        this.subscriptionCtgContent = this.ctgService.ctgContent$.subscribe(
            (content: string) => {
                this.simpleMDE.value(content);
                this.simpleMDE.togglePreview();
            }
        );
    }


    ngAfterViewInit() {
        // var mde = new SimpleMDE({element: this.elementRef.nativeElement.value});
        this.simpleMDE = new SimpleMDE({element: this.textarea.nativeElement});

        this.simpleMDE.codemirror.on("change", () => this.contentChange());

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
     */
    saveContent() {

        let data = new FormData();
        data.append('ctg_id', this.ctgService.getCtg.ctg_id);
        data.append('content', this.simpleMDE.value());

        this.apiHttpService.post(this.apiRouteService.saveCtgContent, data).subscribe(
            response => this.messageService.handleResponse(response, 'ctg_content_updated')
        )
    }


    ngOnDestroy() {
        this.subscriptionCtgContent.unsubscribe();
    }

}

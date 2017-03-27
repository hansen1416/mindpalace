/**
 * Created by hlz on 17-1-28.
 */
// Angular Imports
import {Component, ElementRef, ViewChild} from '@angular/core';

import {CtgService} from './ctg.service';
import {ApiRoutesService} from '../share/api-routes.service';
import {ApiHttpService} from '../share/api-http.service';
import {MessageService} from '../share/message.service';

// Declare Global Variable
let SimpleMDE: any = require('simplemde');

// Define Editor Component
@Component({
               selector   : 'mdeditor',
               templateUrl: './html/simplemde.component.html',
               styles     : [require('./scss/simplemde.component.scss')]
           })
export class SimplemdeComponent {
    @ViewChild('simplemde') textarea: ElementRef;

    constructor(
        private elementRef: ElementRef,
        private ctgService: CtgService,
        private apiRouteService: ApiRoutesService,
        private apiHttpService: ApiHttpService,
        private messageService: MessageService,
    ) {
    }

    private showSaveBtn = false;

    ngAfterViewInit() {
        // var mde = new SimpleMDE({element: this.elementRef.nativeElement.value});
        this.ctgService.simpleMDE = new SimpleMDE({element: this.textarea.nativeElement});

        this.ctgService.simpleMDE.codemirror.on("change", () => this.contentChange());
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
        data.append('ctg_id', this.ctgService.getCtgId);
        data.append('content', this.ctgService.simpleMDE.value());

        this.apiHttpService.post(this.apiRouteService.saveCtgContent, data).subscribe(
            response => {
                if (response.status && response.status == 500) {
                    this.messageService.show(response.error);
                }else{
                    console.log(response);
                }
            }
        )
    }

}

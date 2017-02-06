/**
 * Created by hlz on 17-1-28.
 */
// Angular Imports
import {Component, ElementRef, ViewChild} from '@angular/core';

import {CtgService} from './ctg.service';

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
        private ctgService: CtgService
    ) {
    }

    private showSaveBtn = false;

    ngAfterViewInit() {
        // var mde = new SimpleMDE({element: this.elementRef.nativeElement.value});
        this.ctgService.simpleMDE = new SimpleMDE({element: this.textarea.nativeElement});

        this.ctgService.simpleMDE.codemirror.on("change", ()=>this.contentChange());
    }


    contentChange() {
        
        this.showSaveBtn = true;
    }

}

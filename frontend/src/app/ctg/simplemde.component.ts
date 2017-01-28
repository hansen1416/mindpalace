/**
 * Created by hlz on 17-1-28.
 */
// Angular Imports
import {Component, ElementRef, ViewChild} from '@angular/core';

// Declare Global Variable
var SimpleMDE: any = require('simplemde');

// Define Editor Component
@Component({
               selector:    'mdeditor',
               templateUrl: './html/simplemde.component.html',
           })

// Export Editor Class
export class SimplemdeComponent {
    @ViewChild('simplemde') textarea: ElementRef;

    constructor(private elementRef: ElementRef) {
        // super();
    }

    ngAfterViewInit() {
        var mde = new SimpleMDE({element: this.elementRef.nativeElement.value});
    }
}

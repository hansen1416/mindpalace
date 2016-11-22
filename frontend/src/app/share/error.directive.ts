import { Directive, ElementRef, Renderer } from '@angular/core';

@Directive({ selector: '[error]' })
/** Highlight the attached element in gold */
export class ErrorDirective {
    constructor(el: ElementRef , renderer: Renderer) {
        renderer.setElementStyle(el.nativeElement, 'color', 'red');
        renderer.setElementStyle(el.nativeElement, 'textAlign', 'left');
    }
}

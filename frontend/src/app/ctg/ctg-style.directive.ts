/**
 * Created by mok on 16-11-22.
 */
import {Directive, ElementRef, Input, Renderer} from '@angular/core';

import {CtgService} from './ctg.service';

@Directive({selector: '[ctgStyle]'})
export class CtgStyleDirective {
    constructor(
        el: ElementRef,
        renderer: Renderer,
        ctg: CtgService
    ) {

    }

}

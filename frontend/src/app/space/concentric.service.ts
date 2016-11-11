/**
 * Created by mok on 16-11-11.
 */
import {Injectable} from '@angular/core';

import {CssService} from '../share/css.service';

@Injectable()
export class ConcentricService {

    constructor(
        private css: CssService
    ) {}


    serConcentricCircles(selector: string, radius: number, gap: number): boolean {

        let nodeList = <NodeListOf<HTMLElement>>document.body.querySelectorAll(selector);
        let length   = nodeList.length;

        if (length) {

            let i = 0;

            while (i < length) {

                let transform = this.css.getTransform;
                let alpha     = Math.PI * 2 * i / length;
                let x         = Math.sin(alpha) * radius;
                let y         = Math.cos(alpha) * radius;
                let z         = 0;

                nodeList[i].style[transform] = "translate3d(" + x + "rem, " + y + "rem, " + z + "rem)" +
                                               "rotateY(" + 0 + "rad)" +
                                               "rotateX(" + 0 + "rad)";

                i++;
            }

            return true;
        }

        return false;
    }

}
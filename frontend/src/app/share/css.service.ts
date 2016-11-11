/**
 * Created by mok on 16-11-11.
 */
import {Injectable} from '@angular/core';

@Injectable()
export class CssService {

    private prefixJs: string;


    private transform: string;


    get prefixJs() {

        let userAgent = navigator.userAgent.toLowerCase();

        if (/webkit/gi.test(userAgent)) {
            this.prefixJs = "Webkit";
        } else if (/msie | trident/gi.test(userAgent)) {
            this.prefixJs = "ms";
        } else if (/mozilla/gi.test(userAgent)) {
            this.prefixJs = "Moz";
        } else if (/opera/gi.test(userAgent)) {
            this.prefixJs = "O";
        }

        return this.prefixJs;
    }

    get transform() { //判断浏览器支持那种transform的写法;
        this.transform = (this.prefixJs + "Transform" in document.documentElement.style) ? this.prefixJs + "Transform" : "transform";
        return this.transform;
    }


    static getStyle(target: Element, prop:string) {
        return document.defaultView.getComputedStyle(target, "").getPropertyValue(prop);
    }


}
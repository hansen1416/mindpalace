/**
 * Created by mok on 16-11-11.
 */
import {Injectable} from '@angular/core';

@Injectable()
export class CssService {

    public prefixJs: string;


    public transform: string;


    get getPrefixJs() {

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

    /**
     * //判断浏览器支持那种transform的写法;
     * @returns {string}
     */
    get getTransform() {
        this.transform = (this.getPrefixJs + "Transform" in document.documentElement.style) ? this.getPrefixJs + "Transform" : "transform";
        return this.transform;
    }

    /**
     * get element style
     * @param target
     * @param prop
     * @returns {string}
     */
    static getStyle(target: Element, prop:string) {
        return document.defaultView.getComputedStyle(target, "").getPropertyValue(prop);
    }


}
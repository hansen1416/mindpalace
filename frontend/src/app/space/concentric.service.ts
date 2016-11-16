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


    serConcentricCircles(selector: string): boolean {

        let nodeList = <NodeListOf<HTMLElement>>document.body.querySelectorAll(selector);
        let length   = nodeList.length;

        if (length) {

            let transform = this.css.getTransform;

            //横向排列数目的一半
            let w: number;
            //纵向排列数目的一半
            let h: number;
            //x轴位移
            let x: number;
            //y轴位移
            let y: number;
            //z轴位移
            let z: number;
            //中心空白的宽度
            let a = 20;
            //中心空白的高度
            let b = 15;
            //单个node占据的宽度, 包括margin
            let k = 5;
            //单个node占据的高度, 包括margin
            let g = 3;
            //在当前层的个数
            let i = 0;
            //node[n]
            let n = 0;
            //层数, 0是最内层
            let l = 0;


            while (n < length) {

                w = Math.round(a / k / 2);
                h = Math.round(b / g / 2);

                let t = [
                    w,
                    w + h * 2 - 1,
                    w * 3 + h * 2 - 1,
                    w * 3 + h * 4 - 2,
                    w * 4 + h * 4 - 3
                ];

                //上边的右半部分
                if (i <= t[0]) {
                    x = i * k;
                    y = b / -2;
                    //右边
                } else if (i > t[0] && i <= t[1]) {
                    x = a / 2;
                    y = ((i - t[0]) * g) - (h * g) + g / 2;
                    //底边
                } else if (i > t[1] && i <= t[2]) {
                    x = (w * k) - ((i - t[1]) * k);
                    y = b / 2;
                    //左边
                } else if (i > t[2] && i <= t[3]) {
                    x = a / -2;
                    y = (h * g) - ((i - t[2]) * g) - g / 2;
                    //上边的左半部分
                } else if (i > t[3] && i <= t[4]) {
                    x = ((i - t[3]) * k) - (w * k);
                    y = b / -2;
                } else {
                    i = 0;
                    a = a + k * 2;
                    b = b + g * 2;
                    l++;
                    continue;
                }

                z = 0;

                nodeList[n].style[transform] = "translate3d(" + x + "rem, " + y + "rem, " + z + "rem)" +
                                               "rotateY(" + 0 + "rad)" +
                                               "rotateX(" + 0 + "rad)";

                i++;
                n++;
            }

            return true;
        }

        return false;
    }

}
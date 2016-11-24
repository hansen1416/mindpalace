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

            //横向排列数目
            let w: number;
            //纵向排列数目
            let h: number;
            //x轴位移
            let x: number;
            //y轴位移
            let y: number;
            //中心空白的宽度,unit rem
            let a = 20;
            //中心空白的高度,unit rem
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

            let upperTier = 0;


            let reverse = 1;

            while (n < length) {

                w = Math.round(a / k);
                h = Math.round(b / g);

                let t = [
                    w - 1,
                    w + h - 1,
                    w * 2 + h - 1,
                    w * 2 + h * 2 - 1,
                ];

                /**
                 * 不能超出屏幕宽度
                 */
                if (((a + k) * this.css.remPx) > this.css.bw) {
                    /**
                     * because w has been calculated to the next round above
                     * so here we need to minus one
                     * @type {number}
                     */
                    w -= 1;

                    let remainder = i % w;

                    /**
                     * element distribute upwards
                     * when it's going to reach the top
                     * move the surplus elements to bottom
                     * and distribute all of them downward until last one
                     */
                    if (i && !remainder) {
                        upperTier++;
                        reverse *= -1;
                    }

                    x = (remainder - 2) * k * reverse;
                    y = (b / 2) * -1 - upperTier * g;

                    if (y * this.css.remPx * -2 >= this.css.bh) {
                        break;
                    }


                } else {

                    if (i <= t[0]) {
                        x = (i - w / 2 + 1) * k;
                        y = b / -2;
                        //上边
                    } else if (i > t[0] && i <= t[1]) {
                        x = a / 2;
                        y = ((i - t[0] - h / 2) * g);
                        //右边
                    } else if (i > t[1] && i <= t[2]) {
                        x = (w / 2 - (i - t[1])) * k;
                        y = b / 2;
                        //底边
                    } else if (i > t[2] && i <= t[3]) {
                        x = a / -2;
                        y = ((h / 2 - (i - t[2])) * g);
                        //左边
                    } else {
                        i = 0;
                        a = a + k * 2;
                        b = b + g * 2;
                        l++;
                        continue;
                        /**
                         * 一圈转弯了,将中心空白扩大一圈开始转下一圈
                         */
                    }

                }

                nodeList[n].style[transform] = "translate3d(" + x + "rem, " + y + "rem, 0rem)" +
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
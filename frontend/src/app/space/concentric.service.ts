/**
 * Created by mok on 16-11-11.
 */
import {Injectable} from '@angular/core';

import {CssService} from '../share/css.service';

@Injectable()
export class ConcentricService {

    //中心空白的宽度,unit rem
    private a = 20;
    //中心空白的高度,unit rem
    private b = 15;

    private k = 5;

    private g = 3;

    constructor(
        private css: CssService
    ) {}


    get innerWidth() {
        return this.a;
    }


    set setInnerWidth(a) {
        this.a = a;
    }


    get innerHeight() {
        return this.b;
    }


    set setInnerHeight(b) {
        this.b = b;
    }


    get itemWidth() {
        return this.k;
    }


    get itemHeight() {
        return this.g;
    }


    get horizontalNum() {
        return Math.round(this.innerWidth / this.itemWidth);
    }


    get verticalNum(){
        return Math.round(this.innerHeight / this.itemHeight);
    }

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
            //单个node占据的宽度, 包括margin
            let k = 5;
            //单个node占据的高度, 包括margin
            let g = 3;
            //在当前层的个数
            let i = 0;
            //node[n]
            let n = 0;

            while (n < length) {

                w = this.horizontalNum;
                h = this.verticalNum;

                let t = [
                    w - 1,
                    w + h - 1,
                    w * 2 + h - 1,
                    w * 2 + h * 2 - 1,
                ];

                /**
                 * 不能超出屏幕宽度
                 */
                if (i <= t[0]) {
                    x = (i - w / 2 + 1) * k;
                    y = this.innerHeight / -2;
                    //上边
                } else if (i > t[0] && i <= t[1]) {
                    x = this.innerWidth / 2;
                    y = ((i - t[0] - h / 2) * g);
                    //右边
                } else if (i > t[1] && i <= t[2]) {
                    x = (w / 2 - (i - t[1])) * k;
                    y = this.innerHeight / 2;
                    //底边
                } else if (i > t[2] && i <= t[3]) {
                    x = this.innerWidth / -2;
                    y = ((h / 2 - (i - t[2])) * g);
                    //左边
                } else {
                    i = 0;

                    this.setInnerWidth  = this.innerWidth + k * 2;
                    this.setInnerHeight = this.innerHeight + g * 2;
                    continue;
                    /**
                     * 一圈转弯了,将中心空白扩大一圈开始转下一圈
                     */
                }

                /**
                 * 以顶部和左右为界,不可超出
                 */
                if (Math.abs(x) * this.css.remPx * 2 > this.css.bw || (y < 0 && Math.abs(y) * this.css.remPx * 2 > this.css.bh)) {
                    i++;
                    continue;
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
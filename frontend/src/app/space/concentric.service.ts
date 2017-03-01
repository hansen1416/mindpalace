/**
 * Created by hlz on 16-11-11.
 */
import {Injectable} from '@angular/core';

import {CssService} from '../share/css.service';
import {Position} from './position';

@Injectable()
export class ConcentricService {

    //中心空白的宽度,unit rem
    private a = 25;
    //中心空白的高度,unit rem
    private b = 18;
    //with of single space block
    private k = 5;
    //height of single space block
    private g = 3;
    //在当前层的个数
    private i = 0;
    //node[n]
    private n = 0;

    private positions = <Array<Position>>[];

    constructor(
        private css: CssService
    ) {}


    defineSize(
        innerBlankWidth: number,
        innerBlankHeight: number,
        itemWidth: number,
        itemHeight: number
    ) {
        this.a = innerBlankWidth;
        this.b = innerBlankHeight;
        this.k = itemWidth;
        this.g = itemHeight;
    }


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


    get verticalNum() {
        return Math.round(this.innerHeight / this.itemHeight);
    }


    get getPositions() {
        return this.positions;
    }


    setConcentricCircles<T>(spaces: Array<T>): Array<T> {

        //横向排列数目
        let w: number;
        //纵向排列数目
        let h: number;
        //x轴位移
        let x: number;
        //y轴位移
        let y: number;
        //单个node占据的宽度, 包括margin
        let k = this.itemWidth;
        //单个node占据的高度, 包括margin
        let g = this.itemHeight;

        while (this.n < spaces.length) {

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
            if (this.i <= t[0]) {
                x = (this.i - w / 2 + 1) * k;
                y = this.innerHeight / -2;
                //上边
            } else if (this.i > t[0] && this.i <= t[1]) {
                x = this.innerWidth / 2;
                y = ((this.i - t[0] - h / 2) * g);
                //右边
            } else if (this.i > t[1] && this.i <= t[2]) {
                x = (w / 2 - (this.i - t[1])) * k;
                y = this.innerHeight / 2;
                //底边
            } else if (this.i > t[2] && this.i <= t[3]) {
                x = this.innerWidth / -2;
                y = ((h / 2 - (this.i - t[2])) * g);
                //左边
            } else {
                this.i = 0;

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
                this.i++;
                continue;
            }

            this.positions[this.n] = {x: x, y: y};

            this.i++;
            this.n++;
        }

        return spaces;
    }


}
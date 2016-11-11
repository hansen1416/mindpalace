/**
 * Created by mok on 16-11-8.
 */
import {Injectable} from '@angular/core';

import {CssService} from '../share/css.service';

@Injectable()
export class SpiralService {

    private nodeList: NodeListOf<Element>;

    stage    = document.getElementById('stage');
    //每层球面实际半径
    radius   = 200;
    //每一层球面的间隔
    gap      = 10;
    //一共有多少层
    tiers    = 0;
    //每一层球面上均匀分布的点的数量，不小于该层的元素数量
    N        = 0;
    prevTier = 0;
    //记录每一个 id 对应的空间位置的数据
    allPos   = [];
    //记录当前球面的所有点位位置和旋转，用于赋值，已经复制的点位即删除
    tierPos  = [];
    //记录当前球面的所有点位位置和旋转，如果下一层点的数量和上层相等，则不用计算直接从这里取值
    savedPos = [];


    constructor(
        private css: CssService
    ) {

    }


    /**
     * build the sphere
     * @param selector
     * @returns {boolean}
     */
    setSphere(selector: string): boolean {
        this.nodeList = document.body.querySelectorAll(selector);

        if (this.nodeList.length) {

            this.diffuse();

            this.tiers = this.prevTier - 1;

            this.N        = 0;
            this.prevTier = 0;
            this.allPos   = [];
            this.tierPos  = [];
            this.savedPos = [];

            return true;
        } else {
            return false;
        }
    }


    private diffuse() {

        let stars: NodeListOf<Element> = this.stage.querySelectorAll('.tier-' + this.prevTier);

        //如果没有下一层了，则停止
        if (!stars.length) {
            return false;
        }

        /**
         * 如果是最内层，则空间中的点的数量就是元素的数量
         * 如果不是，则先算出该层的上一层的分类数，记为 elders，再计算哪个父分类中的子分类最多，记为 sons，
         * 然后取 elders*sons，stars.length，N 中的最大者，作为该层球面包含的点的数量
         */
        this.N = this.prevTier ? this.maxPoint(stars, this.N * 2) : stars.length;

        //当前层的半径
        this.radius += this.gap;

        /**
         * 如果计算出的球面的点的数量 N 等于当前储存的 savedPos
         * 那么就直接将 savedPos 赋值给 tierPos
         * 否则通过 fibonacciSphere 计算出球面点的位置和旋转角度
         * 并将返回值赋值给 savedPos 和 tierPos
         */
        this.tierPos = this.fibonacciSphere(this.N, this.radius);

        /**
         * 如果是最内层，则直接给元素定位，不需要考虑上级分类元素的位置
         * 如果不是最内层，则先把这一层所有元素的位置和旋转信息储存起来，
         * 再根据父分类的位置，计算元素所在位置，需要多一次循环
         */
        let i      = 0,
            pos    = null,
            p      = null,
            k      = null,
            s_data = null,
            pid    = 0,
            ctg_id = 0;

        do {
            //如果不是 DOM 对象，则跳出当前 for 循环
            //if (!(stars[i] instanceof Object)) {
            //    continue;
            //}

            s_data = stars[i].dataset;
            pid    = s_data['pid'];
            ctg_id = s_data['ctg_id'];

            /**
             * 外层球面通过父级分类的位置和当前球面的位置数组 tierPos，
             * 计算出应当取哪一个当前点，取到此点之后即将此点从 tierPos 中删除，
             * 如果是最内层，因为 N == stars.length，依序取 tierPos 中的点即可
             */
            if (this.prevTier) {

                p = this.allPos[pid];
                k = this.closestPoint(p, this.tierPos);

                pos = this.tierPos[k];

                //取过的点即删去
                this.tierPos.splice(k, 1);

            } else {

                pos = this.tierPos[i];
            }

            stars[i].style[this.css.transform] =
                "translate3d(" + pos.tx + "px, " + pos.ty + "px, " + pos.tz + "px)" +
                "rotateY(" + pos.ry + "rad)" +
                "rotateX(" + pos.rx + "rad)";

            stars[i].style[this.css.transform] = CssService.getStyle(stars[i], 'transform');

            //记录每一个ctg_id对应的位置，他的子集分类依据此点计算空间中的位置
            if (ctg_id) {
                this.allPos[ctg_id] = {x: pos.tx, y: pos.ty, z: pos.tz};
            }

            i++;

        } while (i < stars.length);

        //深入到下一层
        this.prevTier++;

        this.diffuse();

    }//diffuse ends


    private fibonacciSphere(num: number, radius: number) {

        let dlong = Math.PI * (3 - Math.sqrt(5)),  // ~2.39996323
            dz    = 2.0 / num,
            long  = 0,
            z     = 1 - dz / 2,
            r     = 0,
            arr   = [],
            tx    = 0,          //X方向的位移
            ty    = 0,          //Y方向的位移
            tz    = 0,          //Z方向的位移
            rx    = 0,          //X轴的旋转
            ry    = 0,          //Y轴的旋转
            sz    = 0,          //Z位移的正负号
            i     = 0;

        do {

            r    = Math.sqrt(1 - z * z);
            tx   = Math.cos(long) * r * radius;
            ty   = Math.sin(long) * r * radius;
            tz   = z * radius;
            z    = z - dz;
            long = long + dlong;

            //判断元素是在z轴正方向还是负方向
            sz = tz / Math.abs(tz);
            sz = isNaN(sz) ? 1 : sz;
            //如果是在Z轴正方向，
            //则把元素沿y轴多旋转180度，使得正面朝向圆心
            if (sz > 0) {
                ry = Math.atan(tx / tz) + Math.PI;
            } else {
                ry = Math.atan(tx / tz);
            }

            rx = Math.asin(ty / radius);

            arr[i] = {tx: tx, ty: ty, tz: tz, ry: ry, rx: rx};

            i++;

        } while (i < num);

        return arr;

    }


    private maxPoint(arr: NodeListOf<Element>, n: number) {
        /**
         * keys 储存父级分类的 id
         * values 储存每一个父级分类包含的子分类的个数
         * j 表示 values 的键名
         */
        let keys   = [],
            values = [],
            j      = -1,
            i      = 0;

        do {

            if (!(arr[i] instanceof Object)) {
                continue;
            }
            let pid = arr[i].dataset.pid;

            if (keys[pid] === undefined) {
                j++;
                keys[pid] = true;
                values[j] = 1;
            } else {
                values[j]++;
            }

            i++;

        } while (i < arr.length);

        let f = values.length,
            s = Math.max.apply(null, values);

        return Math.max(f * s, arr.length, n);
    }


    private closestPoint(parentPos: Array, posArray: Array) {
        let dis = null,
            d   = 0,
            k   = 0,
            x   = 0,
            y   = 0,
            z   = 0,
            i   = 0;

        do {

            x = posArray[i]['tx'] - parentPos['x'];
            y = posArray[i]['ty'] - parentPos['y'];
            z = posArray[i]['tz'] - parentPos['z'];

            d = Math.sqrt(x * x + y * y + z * z);
            //如果还没有最小距离，则把当前点计算出的最小距离和数组中的键名记录下来
            if (dis === null) {
                dis = d;
                k   = i;
                continue;
            }
            //如果当前计算出的空间亮点距离小于之前的最小距离
            //则记录当前的最小距离和数组中的键名
            if (d < dis) {
                dis = d;
                k   = i;
            }

            i++;

        } while (i < posArray.length);

        return k;
    }


}
/**
 * Created by mok on 16-12-14.
 */
import {Injectable} from '@angular/core';

// import * as THREE from "three";
// import * as TWEEN from "tween.js";
declare var THREE: any;

import {Ctg} from '../ctg/ctg';
import {Position} from './position';

@Injectable()
export class ThreeService {

    protected view_angle = 50;

    protected near = 0.1;

    protected far = 1000;

    protected container: HTMLElement;

    protected width: number;

    protected height: number;

    protected webGLRenderer: THREE.WebGLRenderer;

    protected webGLScene: THREE.Scene;

    protected camera: THREE.Object3D & THREE.Camera & THREE.PerspectiveCamera;

    protected controls: THREE.TrackballControls;

    protected spriteGroup: THREE.Group & THREE.Object3D;

    protected lineGroup: THREE.Group & THREE.Object3D;

    protected raycaster: THREE.Raycaster;

    protected mouse: THREE.Vector2 & {x: number, y: number};

    protected data = <Array<Array<Ctg>>>[];

    protected tierCtgNum = 0;

    /**
     * process the data, to two dimensional array
     * @param data
     */
    processData(data: Ctg[]): void {

        let i = 0;
        while (i < data.length) {

            if (this.data[data[i].tier]) {
                this.data[data[i].tier].push(data[i]);
            } else {
                this.data[data[i].tier] = [data[i]];
            }

            i++;
        }
    }

    /**
     * 初始化场景
     */
    protected initWebGL(): void {
        this.container = document.getElementById('canvas-frame');
        this.width     = this.container.clientWidth;
        this.height    = this.container.clientHeight;

        this.webGLRenderer = new THREE.WebGLRenderer({antialias: true});
        this.webGLScene    = new THREE.Scene();
        this.camera        = new THREE.PerspectiveCamera(
            this.view_angle,
            this.width / this.height,
            this.near,
            this.far
        );
        this.mouse         = new THREE.Vector2();
        this.raycaster     = new THREE.Raycaster();

        // Set the background color of the renderer to gray, with full opacity
        this.webGLRenderer.setClearColor(0x3d51b7, 1);
        this.webGLRenderer.setSize(this.width, this.height);
        this.container.appendChild(this.webGLRenderer.domElement);
    }

    /**
     * track ball control, rotate camera as mouse move
     */
    protected trackBallControl(): void {
        this.controls = new THREE.TrackballControls(this.camera);

        this.controls.rotateSpeed          = 1;
        this.controls.zoomSpeed            = 1;
        this.controls.panSpeed             = 1;
        this.controls.noZoom               = false;
        this.controls.noPan                = false;
        this.controls.staticMoving         = false;//惯性
        this.controls.dynamicDampingFactor = 0.2;//阻力
        this.controls.keys                 = [65, 83, 68];

        this.controls.addEventListener('change', ()=>this.renderWebGL());
    }

    /**
     * http://web.archive.org/web/20120421191837/http://www.cgafaq.info/wiki/Evenly_distributed_points_on_sphere
     * positioning the points by spiral Fibonacci method
     * 在球面做一条螺旋线，依照螺旋线按照黄金分割取点，获取近似的球面均匀分布的点位
     * @param num 点的总数
     * @param radius 球面半径
     * @returns {Array}
     */
    private static fibonacciSphere(num: number, radius: number): Position[] {

        let dlong = Math.PI * (3 - Math.sqrt(5)),  // ~2.39996323
            dz    = 2.0 / num,
            long  = 0,
            z     = 1 - dz / 2,
            r     = 0,
            arr   = [],
            tx    = 0,          //X方向的位移
            ty    = 0,          //Y方向的位移
            tz    = 0,          //Z方向的位移
            // rx    = 0,          //X轴的旋转
            // ry    = 0,          //Y轴的旋转
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

            // //如果是在Z轴正方向，
            // //则把元素沿y轴多旋转180度，使得正面朝向圆心
            // if (sz > 0) {
            //     ry = Math.atan(tx / tz) + Math.PI;
            // } else {
            //     ry = Math.atan(tx / tz);
            // }

            // rx = Math.asin(ty / radius);

            arr[i] = <Position>{x: tx, y: ty, z: tz};

            i++;

        } while (i < num);

        return arr;

    }

    /**
     * 计算出每个球面上应该有多少个均匀分布的点
     * 先算出该层的上一层的分类数，记为 f，再计算哪个父分类中的子分类最多，记为 s，
     * 然后取 f*s，arr.length，n 中的最大者，作为该层球面包含的点的数量
     * @param ctgList
     * @param n
     * @returns {number}
     */
    private maxPoint(ctgList: Ctg[], n: number): number {
        /**
         * keys 储存父级分类的 id
         * values 储存每一个父级分类包含的子分类的个数
         * j 表示 values 的键名
         */
        let keys   = [],
            values = [],
            j      = -1,
            i      = 0;

        while (i < ctgList.length) {

            let pid = ctgList[i]['pid'];

            if (keys[pid] === undefined) {
                j++;
                keys[pid] = true;
                values[j] = 1;
            } else {
                values[j]++;
            }

            i++;
        }

        let s = Math.max.apply(null, values);

        this.tierCtgNum = 1 == values.length ? 1 : Math.max(this.tierCtgNum, s);

        return Math.max(this.tierCtgNum * s, n);
    }

    /**
     * 从位置数组中寻找离空间中指定点最近的点
     * @param parentPos
     * @param posArray
     * @returns {number}
     */
    private static closestPoint(parentPos: Position, posArray: Position[]): number {
        let dis = null,
            d   = 0,
            k   = 0,
            x   = 0,
            y   = 0,
            z   = 0,
            i   = 0;

        while (i < posArray.length) {

            x = posArray[i]['x'] - parentPos['x'];
            y = posArray[i]['y'] - parentPos['y'];
            z = posArray[i]['z'] - parentPos['z'];

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

        }

        return k;
    }

    /**
     * draw a text sprite
     * @param text
     * @returns {THREE.Sprite}
     */
    private static drawTextSprite(text: string): THREE.Object3D & THREE.Sprite {
        //c_w & c_h must be power of 2
        let c_w    = 256;
        let c_h    = 64;
        let canvas = document.createElement('canvas');

        canvas.width  = c_w;
        canvas.height = c_h;

        let context = canvas.getContext('2d');

        context.font = "normal " + c_h * 2 / 3.5 + "px Serial";

        context.textAlign    = 'center';
        context.textBaseline = 'middle';

        context.fillStyle = 'rgba(255,255,255,0.7)';
        context.fillRect(0, 0, c_w, c_h);

        context.fillStyle = '#000000';
        context.fillText(text, c_w / 2, c_h / 2);

        let spriteTexture = new THREE.Texture(canvas);

        spriteTexture.needsUpdate = true;

        let spriteMaterial = new THREE.SpriteMaterial({
            map: spriteTexture
        });

        spriteMaterial.transparent = true;

        let sprite = new THREE.Sprite(spriteMaterial);

        sprite.scale.set(c_w / c_h, 1, 1);

        spriteTexture.dispose();
        spriteMaterial.dispose();

        return sprite;
    }

    /**
     * draw a line between two ctg
     * @param pos1
     * @param pos2
     * @param name
     * @returns {THREE.Line}
     */
    private static drawLineBetweenTwoCtg(pos1: Position, pos2: Position, name: string): THREE.Object3D & THREE.Line {
        let lineMaterial = new THREE.LineBasicMaterial({
            linewidth   : 1.5,
            opacity     : 0.3,
            vertexColors: true
        });

        lineMaterial.transparent = true;

        let lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push(new THREE.Vector3(pos1.x, pos1.y, pos1.z));
        lineGeometry.vertices.push(new THREE.Vector3(pos2.x, pos2.y, pos2.z));
        lineGeometry.colors.push(new THREE.Color(0xffffff), new THREE.Color(0xA359FE));

        lineMaterial.dispose();
        lineGeometry.dispose();

        let line = new THREE.Line(lineGeometry, lineMaterial);

        line.name = name;
        return line;
    }

    /**
     * draw text on sprite
     */
    protected buildSpheres(): void {

        this.spriteGroup = new THREE.Group();
        this.lineGroup   = new THREE.Group();

        let item: Ctg[];
        //每一层之间的距离
        let radius = 4;
        //层数
        let tier   = 0;
        //the max points number on each tier
        let N           = 0;

        let pos: Position;
        //positions of all points, use ctg_id as index
        let allPos = <Position[]>[];

        let pid: number;
        let ctg_id: number;

        /**
         * data is like this [2: [Sprite, Sprite, ..], 3 : [..], ..]
         * each tier is an array
         */
        for (let prop in this.data) {
            item = this.data[prop];

            /**
             * the sprite on each tier composed into a sphere
             */
            if (item && item.length > 0) {

                /**
                 * points on the core tier is item.length
                 * on other tiers, the number of points calculated by the maxPoint()
                 * which will always equal or greater than the inner tier
                 * @type {number}
                 */
                N = (tier <= 1) ? item.length : this.maxPoint(item, N);

                /**
                 * every space has a root ctg, it;s position is 0,0,0  tier = 0, all the other ctg is the root's descendant
                 * position of the point on each tier has been calculated by the fibonacciSphere()
                 * evenly distributed on the sphere
                 * @type {Position[]}
                 */
                let positions = (tier == 0) ? <Position[]>[
                    {
                        x: 0,
                        y: 0,
                        z: 0
                    }
                ] : ThreeService.fibonacciSphere(N, radius * (tier + 1));

                for (let i = 0; i < item.length; i++) {
                    //draw text sprite
                    let sprite = ThreeService.drawTextSprite(item[i].ctg.title);

                    /**
                     * set a position for text sprite
                     * if it has a parent ctg, find the closet point to its parent
                     */
                    pos = positions[i];
                    pid    = item[i]['pid'];
                    ctg_id = item[i]['ctg_id'];

                    if (1 <= tier && undefined !== allPos[pid]) {

                        let k = ThreeService.closestPoint(allPos[pid], positions);

                        pos = positions[k];
                        //remove the occupied position
                        positions.splice(k, 1);
                    }

                    sprite.position.set(pos.x, pos.y, pos.z);
                    //use ctg_id as the sprite's name
                    sprite.name = item[i]['ctg_id'].toString();
                    /**
                     * save userData for text sprite
                     * @type {Ctg}
                     */
                    sprite.userData = item[i];
                    //remember all positions
                    allPos[ctg_id] = pos;

                    this.spriteGroup.add(sprite);

                    //draw lines
                    if (pid && allPos[pid]) {
                        this.lineGroup.add(ThreeService.drawLineBetweenTwoCtg(allPos[pid], allPos[ctg_id], pid + '-' + ctg_id));
                    }

                }
            }

            tier++;
        }

        this.setCameraPositionAndZoomDistance(radius, tier);

        this.webGLScene.add(this.spriteGroup);
        this.webGLScene.add(this.lineGroup);
    }

    /**
     * set the camera initial position
     * set the track ball control min & max zoom distance
     * min distance can not be minus
     * @param radius
     * @param tier
     */
    private setCameraPositionAndZoomDistance(radius: number, tier: number) {
        let d = (radius * (tier + 1)) * 1.8;
        //set the camera zoom range and camera position
        this.camera.position.set(0, 0, d);
        this.camera.lookAt(this.webGLScene.position);

        // this.controls.target = new THREE.Vector3(0, 0, -10);
        this.controls.minDistance = 0;
        this.controls.maxDistance = d;
    }


    protected renderWebGL(): void {
        this.webGLRenderer.render(this.webGLScene, this.camera);
    }


}
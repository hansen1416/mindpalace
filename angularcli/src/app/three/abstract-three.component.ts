/**
 * Created by hlz on 17-1-18.
 */
import {Component} from '@angular/core';

import {Ctg} from '../ctg/ctg';
import {SpacePosition} from '../share/coordinates';

import * as THREE from 'three';
import TrackballControls from "three-trackballcontrols";

@Component({
               selector: 'abstract-three',
               template: ''
           })
export class AbstractThreeComponent {
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

    protected firstTime = true;

    constructor() {

    }

    /**
     * process the data, to two dimensional array
     * @param data
     */
    protected processData(data: Ctg[]): void {
        this.data = [];
        let i     = 0;
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
        this.controls = new TrackballControls(this.camera, this.webGLRenderer.domElement);

        this.controls.rotateSpeed          = 1;
        this.controls.zoomSpeed            = 1;
        this.controls.panSpeed             = 1;
        this.controls.noZoom               = false;
        this.controls.noPan                = false;
        this.controls.staticMoving         = false;//惯性
        this.controls.dynamicDampingFactor = 0.2;//阻力
        this.controls.keys                 = [65, 83, 68];
        //this is not necessary, because in raycast there is a this.controls.update()
        this.controls.addEventListener('change', () => this.renderWebGL());
    }

    /**
     * http://web.archive.org/web/20120421191837/http://www.cgafaq.info/wiki/Evenly_distributed_points_on_sphere
     * positioning the points by spiral Fibonacci method
     * 在球面做一条螺旋线，依照螺旋线按照黄金分割取点，获取近似的球面均匀分布的点位
     * @param num 点的总数
     * @param radius 球面半径
     * @returns {Array}
     */
    private fibonacciSphere(num: number, radius: number): SpacePosition[] {

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

            arr[i] = <SpacePosition>{x: tx, y: ty, z: tz};

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
        //values 中是上一层在这一层中包含的子分类的个数，取他中的最大值
        let s           = Math.max.apply(null, values);
        //上一层的 todo here is wrong
        this.tierCtgNum = 1 == values.length ? 1 : Math.max(this.tierCtgNum, s);
        //24 is the minimum to keep the child to one direction
        return Math.max(this.tierCtgNum * s, n, ctgList.length, 24);
    }

    /**
     * 从位置数组中寻找离空间中指定点最近的点
     * @param parentPos
     * @param posArray
     * @returns {number}
     */
    private closestPoint(parentPos: SpacePosition, posArray: SpacePosition[]): number {
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
    private drawTextSprite(text: string): THREE.Object3D & THREE.Sprite {
        //canvas size c_w & c_h shall be power of 2, otherwise there will be plenty of console info
        let canvas  = document.createElement('canvas');
        let context = canvas.getContext('2d');
        let c_w     = Math.round(context.measureText(text).width * 2.55 + 12);
        let c_h     = 32;

        //minimum width is 64
        c_w = c_w < 64 ? 64 : c_w;

        canvas.width         = c_w;
        canvas.height        = c_h;
        //font size and align of text
        context.font         = "normal " + c_h * 2 / 2.5 + "px Serial";
        context.textAlign    = 'center';
        context.textBaseline = 'middle';
        //canvas background color
        context.fillStyle    = 'rgba(255,255,255,0.7)';
        context.fillRect(0, 0, c_w, c_h);
        //text color
        context.fillStyle = '#000000';
        context.fillText(text, c_w / 2, c_h / 2);
        //sprite texture
        let spriteTexture         = new THREE.Texture(canvas);
        spriteTexture.needsUpdate = true;

        // this will get rid of the image is not power of 2 warning,
        // but the texture is not clear,
        // so delete the console warn ar line 96 in three.min.js instead
        // spriteTexture.minFilter = THREE.LinearFilter;

        //sprite material
        let spriteMaterial = new THREE.SpriteMaterial({
            map: spriteTexture
        });

        spriteMaterial.transparent = true;

        //three sprite
        let sprite = new THREE.Sprite(spriteMaterial);

        sprite.scale.set(c_w / c_h, 1, 1);

        spriteTexture.dispose();
        spriteMaterial.dispose();

        canvas = undefined;

        return sprite;
    }

    /**
     * draw a line between two ctg
     * @param pos1
     * @param pos2
     * @param name
     * @returns {THREE.Line}
     */
    private drawLineBetweenTwoCtg(pos1: SpacePosition, pos2: SpacePosition, name: string): THREE.Object3D & THREE.Line {
        let lineMaterial = new THREE.LineBasicMaterial({
            linewidth   : 1.5,
            opacity     : 0.3
        });

        lineMaterial.transparent = true;

        let lineGeometry = new THREE.Geometry();

        lineGeometry.vertices.push(new THREE.Vector3(pos1.x, pos1.y, pos1.z));
        lineGeometry.vertices.push(new THREE.Vector3(pos2.x, pos2.y, pos2.z));
        lineGeometry.colors.push(new THREE.Color(0xffffff), new THREE.Color(0xA359FE));

        let line = new THREE.Line(lineGeometry, lineMaterial);

        lineMaterial.dispose();
        lineGeometry.dispose();

        line.name = name;
        return line;
    }

    /**
     * draw text on sprite
     */
    protected buildSpheres(): void {
        try {
            if (this.spriteGroup) {
                this.webGLScene.remove(this.spriteGroup);
            }

            if (this.lineGroup) {
                this.webGLScene.remove(this.lineGroup);
            }

            this.spriteGroup = new THREE.Group();
            this.lineGroup   = new THREE.Group();

            let item: Ctg[];
            //每一层之间的距离
            let radius = 5.5;
            //层数
            let tier   = 0;
            //the max points number on each tier
            let N      = 0;

            let pos: SpacePosition;
            //positions of all points, use ctg_id as index
            let allPos = <SpacePosition[]>[];

            let pid: number;
            let ctg_id: number;

            /**
             * data is like this [2: [Sprite, Sprite, ..], 3 : [..], ..]
             * each tier is an array
             */
            for (let prop in this.data) {
                item = this.data[prop];

                if (!item || item.length <= 0) {
                    continue;
                }
                /**
                 * the sprite on each tier composed into a sphere
                 */


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
                 * @type {SpacePosition[]}
                 */
                let positions = (tier == 0) ? <SpacePosition[]>[
                                                {
                                                    x: 0,
                                                    y: 0,
                                                    z: 0
                                                }
                                            ] : this.fibonacciSphere(N, radius * (tier + 1));

                for (let i = 0; i < item.length; i++) {
                    //draw text sprite
                    let sprite = this.drawTextSprite(item[i].ctg.title);

                    /**
                     * set a position for text sprite
                     * if it has a parent ctg, find the closet point to its parent
                     */
                    pos = positions[i];
                    pid    = item[i]['pid'];
                    ctg_id = item[i]['ctg_id'];

                    if (1 <= tier && undefined !== allPos[pid]) {

                        let k = this.closestPoint(allPos[pid], positions);

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

                    sprite = undefined;

                    //draw lines
                    if (pid && allPos[pid]) {
                        this.lineGroup.add(this.drawLineBetweenTwoCtg(allPos[pid], allPos[ctg_id], pid + '-' + ctg_id));
                    }

                }
                //for item

                tier++;
            }
            //let in this.data

            this.webGLScene.add(this.spriteGroup);
            this.webGLScene.add(this.lineGroup);

            item   = null;
            allPos = null;

            this.setCameraPositionAndZoomDistance(radius, tier);
        } catch (e) {
            console.warn(e);
        }
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
        if (this.firstTime) {
            this.camera.position.set(0, 0, d);
            this.camera.lookAt(this.webGLScene.position);
        }

        this.controls.target = new THREE.Vector3(0, 0, 0);
        this.controls.minDistance = 0;
        this.controls.maxDistance = d;
    }


    protected renderWebGL(): void {
        this.webGLRenderer.render(this.webGLScene, this.camera);
    }
}
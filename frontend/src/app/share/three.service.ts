/**
 * Created by mok on 16-12-14.
 */
import {Injectable} from '@angular/core';

// import * as THREE from "three";
// import * as TWEEN from "tween.js";
declare var THREE: any;

import {Ctg} from '../ctg/ctg';

/**
 * 空间中点的位置
 * tx: translateX
 * ty: translateY
 * tz: translateZ
 * ry: rotateY
 * rx: rotateX
 */
class Position {
    x: number;
    y: number;
    z: number;
}

@Injectable()
export class ThreeService {

    private view_angle = 50;

    private near = 0.1;

    private far = 1000;

    private container: HTMLElement;

    private width: number;

    private height: number;

    private webGLRenderer;

    private webGLScene;

    private camera;

    private controls;

    private group;

    private raycaster;

    private mouse;

    private intersect;

    private data = [];


    // private CSS3DRender;
    // private CSS3DScene;

    /**
     * 初始化场景
     */
    private initWebGL() {
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
        this.webGLRenderer.setClearColor(0xcccccc, 1);
        this.webGLRenderer.setSize(this.width, this.height);
        this.container.appendChild(this.webGLRenderer.domElement);

        this.camera.position.set(0, 0, -1);
        this.camera.lookAt(this.webGLScene.position);
        this.webGLScene.add(this.camera);
    }

    /**
     * track ball control, rotate camera as mouse move
     */
    private trackBallControl() {
        this.controls = new THREE.TrackballControls(this.camera);

        this.controls.rotateSpeed          = 2.0;
        this.controls.zoomSpeed            = 2.2;
        this.controls.panSpeed             = 0.8;
        this.controls.noZoom               = false;
        this.controls.noPan                = false;
        this.controls.staticMoving         = false;//惯性
        this.controls.dynamicDampingFactor = 0.2;//阻力
        this.controls.keys                 = [65, 83, 68];

        this.controls.addEventListener('change', ()=>this.renderWebGL());
    }


    processData(data: Ctg[]) {

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
     * draw text on sprite
     */
    private drawText(): void {

        this.group = new THREE.Group();

        let canvas: HTMLCanvasElement;
        let context: CanvasRenderingContext2D;
        let texture: THREE.Texture;
        let material: THREE.Material;
        let sprite: THREE.Sprite;
        //c_w & c_h must be power of 2
        let c_w = 256;
        let c_h = 64;
        //每一层之间的距离
        let r = 4;
        //层数
        let n = 1;

        /**
         * data is like this [1: [Sprite, Sprite, ..], 2 : [..], ..]
         * each tier is an array
         */
        for (let item of this.data) {

            /**
             * in each tier, the sprite each tier is a sphere
             */
            if (item.length) {

                let positions = ThreeService.fibonacciSphere(item.length, r * n+2);

                for (let i = 0; i < item.length; i++) {

                    canvas = document.createElement('canvas');

                    canvas.width  = c_w;
                    canvas.height = c_h;

                    context = canvas.getContext('2d');

                    context.font = "normal " + c_h * 2 / 3.5 + "px Serial";

                    context.textAlign    = 'center';
                    context.textBaseline = "middle";

                    context.fillStyle = 'rgba(255,255,' + n * 40 + ',0.7)';
                    context.fillRect(0, 0, c_w, c_h);

                    context.fillStyle = '#000000';
                    context.fillText(item[i].title, c_w / 2, c_h / 2);

                    texture = new THREE.Texture(canvas);

                    texture.needsUpdate = true;

                    material = new THREE.SpriteMaterial({
                        map: texture
                    });

                    material.transparent = true;

                    sprite = new THREE.Sprite(material);

                    sprite.scale.set(c_w / c_h * 0.5, 0.5, 1);

                    texture.dispose();
                    material.dispose();

                    sprite.position.set(
                        positions[i].x,
                        positions[i].y,
                        positions[i].z
                    );
                    
                    sprite.userData = item[i];

                    this.group.add(sprite);
                }
            }

            n++;
        }

        this.webGLScene.add(this.group);
    }

    /**
     * get mouse position
     * @param event
     */
    private onMouseMove(event) {
        event.preventDefault();

        // normalize between -1 and +1
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
    }

    /**
     * get the mouse over object
     */
    private raycast() {

        let currentObject;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        currentObject = this.raycaster.intersectObjects(this.group.children);

        if (currentObject.length > 0) {

            if (this.intersect && this.intersect.object.uuid != currentObject[0].object.uuid) {
                this.intersect.object.material.color.set(0xffffff);
            }
            currentObject[0].object.material.color.set(0xff0000);
            this.intersect = currentObject[0];
        }
    }


    private renderAnimate() {

        requestAnimationFrame(()=>this.renderAnimate());

        this.controls.update();
        this.raycast();
        this.renderWebGL();
    }


    private renderWebGL() {
        this.webGLRenderer.render(this.webGLScene, this.camera);
    }


    project() {

        this.initWebGL();

        this.drawText();

        this.trackBallControl();

        this.webGLRenderer.domElement.addEventListener('mousemove', ()=>this.onMouseMove(event), false);

        this.renderAnimate();
    }


    // initCSS3D() {
    //     this.CSS3DRender = new THREE.CSS3DRenderer();
    //     this.CSS3DRender.setSize(this.width, this.height);
    //     this.CSS3DRender.domElement.style.position = 'absolute';
    //     this.CSS3DRender.domElement.style.top      = '0';
    //     this.container.appendChild(this.CSS3DRender.domElement);
    //
    //     this.CSS3DScene = new THREE.Scene();
    //
    //     this.setCamera();
    //     this.camera.lookAt(this.CSS3DScene.position);
    //     this.CSS3DScene.add(this.camera);
    // }
    //
    // renderBoth() {
    //     this.CSS3DRender.render(this.CSS3DScene, this.camera);
    //     this.webGLRenderer.render(this.webGLScene, this.camera);
    // }
    //
    // renderCSS3D() {
    //     this.CSS3DRender.render(this.CSS3DScene, this.camera);
    // }

}
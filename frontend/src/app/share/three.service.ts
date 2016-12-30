/**
 * Created by mok on 16-12-14.
 */
import {Injectable} from '@angular/core';

// import * as THREE from "three";
// import * as TWEEN from "tween.js";
declare var THREE: any;

@Injectable()
export class ThreeService {

    private view_angle = 50;

    private near = 0.1;

    private far = 1000;

    private container: HTMLElement;

    private width: number;

    private height: number;

    private webGLRenderer;

    private CSS3DRender;

    private webGLScene;

    private CSS3DScene;

    private camera;

    private controls;

    setCamera() {

        if (!this.camera) {
            this.camera = new THREE.PerspectiveCamera(
                this.view_angle,
                this.width / this.height,
                this.near,
                this.far
            );

            this.camera.position.set(0, 0, 30);
        }
    }


    initWebGL() {
        this.container = document.getElementById('canvas-frame');
        this.width     = this.container.clientWidth;
        this.height    = this.container.clientHeight;

        this.webGLRenderer = new THREE.WebGLRenderer({antialias: true});
        // Set the background color of the renderer to gray, with full opacity
        this.webGLRenderer.setClearColor(0xcccccc, 1);
        this.webGLRenderer.setSize(this.width, this.height);
        this.container.appendChild(this.webGLRenderer.domElement);


        this.webGLScene = new THREE.Scene();

        this.setCamera();
        this.camera.lookAt(this.webGLScene.position);
        this.webGLScene.add(this.camera);

    }


    initCSS3D() {
        this.CSS3DRender = new THREE.CSS3DRenderer();
        this.CSS3DRender.setSize(this.width, this.height);
        this.CSS3DRender.domElement.style.position = 'absolute';
        this.CSS3DRender.domElement.style.top      = '0';
        this.container.appendChild(this.CSS3DRender.domElement);

        this.CSS3DScene = new THREE.Scene();

        this.setCamera();
        this.camera.lookAt(this.CSS3DScene.position);
        this.CSS3DScene.add(this.camera);
    }


    trackBallControl() {
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


    controlsAnimate() {
        this.controls.update();
        requestAnimationFrame(()=>this.controlsAnimate());
    }


    renderBoth() {
        this.CSS3DRender.render(this.CSS3DScene, this.camera);
        this.webGLRenderer.render(this.webGLScene, this.camera);
    }

    renderWebGL() {
        this.webGLRenderer.render(this.webGLScene, this.camera);
    }

    renderCSS3D() {
        this.CSS3DRender.render(this.CSS3DScene, this.camera);
    }


    project() {

        this.trackBallControl();

        let group  = new THREE.Group();
        let canvas = document.createElement('canvas');

        canvas.width  = 64;
        canvas.height = 16;

        let context = canvas.getContext('2d');

        context.textAlign = 'center';
        context.fillStyle = 'rgb(0,0,0)';

        for (let i = 0; i < 100; i++) {
            context.fillText('11', 25, 10);

            let texture = new THREE.Texture(canvas);

            texture.needsUpdate = true;

            let material = new THREE.SpriteMaterial({
                map: texture
            });

            material.needsUpdate = true;

            let sprite   = new THREE.Sprite(material);

            texture.dispose();
            material.dispose();

            let x = Math.random() * 100 - 50;
            let y = Math.random() * 100 - 50;
            let z = Math.random() * 100 - 50;

            sprite.position.set(x, y, z);
            // sprite.position.normalize();
            // sprite.position.multiplyScalar(50);

            group.add(sprite);
        }

        this.webGLScene.add(group);

        this.controlsAnimate();

        this.renderWebGL();
    }


}
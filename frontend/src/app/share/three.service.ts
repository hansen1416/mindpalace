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

    private renderer;

    private scene;

    private camera;


    init() {
        this.container = document.getElementById('canvas-frame');
        this.width     = this.container.clientWidth;
        this.height    = this.container.clientHeight;

        // Check whether the browser supports WebGL. If so, instantiate the hardware accelerated
        // WebGL renderer. For antialiasing, we have to enable it. The canvas renderer uses
        // antialiasing by default.
        // The approach of multiple renderers is quite nice, because your scene can also be
        // viewed in browsers, which don't support WebGL. The limitations of the canvas renderer
        // in contrast to the WebGL renderer will be explained in the tutorials, when there is a
        // difference.
        // if (Detector.webgl) {
        // this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer = new THREE.CSS3DRenderer();

        // If its not supported, instantiate the canvas renderer to support all non WebGL
        // browsers
        // } else {
        //     this.renderer = new THREE.CanvasRenderer();
        // }

        // Set the background color of the renderer to gray, with full opacity
        this.renderer.setClearColor(0xcccccc, 1);

        this.renderer.setSize(this.width, this.height);
        this.container.appendChild(this.renderer.domElement);

        this.scene = new THREE.Scene();

        // Now that we have a scene, we want to look into it. Therefore we need a camera.
        // Three.js offers three camera types:
        //  - PerspectiveCamera (perspective projection)
        //  - OrthographicCamera (parallel projection)
        //  - CombinedCamera (allows to switch between perspective / parallel projection
        //    during runtime)
        // In this example we create a perspective camera. Parameters for the perspective
        // camera are ...
        // ... field of view (FOV),
        // ... aspect ratio (usually set to the quotient of canvas width to canvas height)
        // ... near and
        // ... far.
        // Near and far define the cliping planes of the view frustum. Three.js provides an
        // example (http://mrdoob.github.com/three.js/examples/
        // -> canvas_camera_orthographic2.html), which allows to play around with these
        // parameters.
        // The camera is moved 10 units towards the z axis to allow looking to the center of
        // the scene.
        // After definition, the camera has to be added to the scene.
        this.camera = new THREE.PerspectiveCamera(
            this.view_angle,
            this.width / this.height,
            this.near,
            this.far
        );
        this.camera.position.set(0, 0, 10);
        this.camera.lookAt(this.scene.position);
        this.scene.add(this.camera);
    }


    project() {

        let camera   = this.camera;
        let scene    = this.scene;
        let renderer = this.renderer;
        let controls = new THREE.TrackballControls(camera);

        controls.rotateSpeed          = 1.0;
        controls.zoomSpeed            = 1.2;
        controls.panSpeed             = 0.8;
        controls.noZoom               = false;
        controls.noPan                = false;
        controls.staticMoving         = true;
        controls.dynamicDampingFactor = 0.3;
        controls.keys                 = [65, 83, 68];

        let x = this;

        controls.addEventListener('change', ()=>x.render());

        let material = new THREE.SpriteMaterial({
            color: 0x0000ff
        });

        let group = new THREE.Group();

        for (let i = 0; i < 100; i++) {
            let sprite = new THREE.Sprite(material);

            let x = Math.random() * 10 - 5;
            let y = Math.random() * 10 - 5;
            let z = Math.random() * 10 - 5;

            sprite.position.set(x, y, z);

            group.add(sprite);
        }

        scene.add(group);

        function ani() {

            requestAnimationFrame(ani);
            controls.update();
        }

        ani();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }


}
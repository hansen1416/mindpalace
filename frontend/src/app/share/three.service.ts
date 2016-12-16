/**
 * Created by mok on 16-12-14.
 */
import {Injectable} from '@angular/core';

import * as THREE from "three";
import * as TWEEN from "tween.js";

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
        if (Detector.webgl) {
            this.renderer = new THREE.WebGLRenderer({antialias: true});

            // If its not supported, instantiate the canvas renderer to support all non WebGL
            // browsers
        } else {
            this.renderer = new THREE.CanvasRenderer();
        }

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

        // Create the triangle (or any arbitrary geometry).
        // 1. Instantiate the geometry object
        // 2. Add the vertices
        // 3. Define the faces by setting the vertices indices
        var triangleGeometry = new THREE.Geometry();
        triangleGeometry.vertices.push(new THREE.Vector3(0.0, 1.0, 0.0));
        triangleGeometry.vertices.push(new THREE.Vector3(-1.0, -1.0, 0.0));
        triangleGeometry.vertices.push(new THREE.Vector3(1.0, -1.0, 0.0));
        triangleGeometry.faces.push(new THREE.Face3(0, 1, 2));

        var triangleMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            side : THREE.DoubleSide
        });

    }


}
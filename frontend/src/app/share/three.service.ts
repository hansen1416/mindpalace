/**
 * Created by mok on 16-12-14.
 */
import {Injectable} from '@angular/core';

import * as THREE from "three";
import * as TWEEN from "tween.js";

@Injectable()
export class ThreeService {

    private view_angle = 45;

    private near = 0.1;

    private far = 1000;

    private container: HTMLElement;

    private width: number;

    private height: number;


    renderer() {
        this.container = document.getElementById('canvas-frame');
        this.width     = this.container.clientWidth;
        this.height    = this.container.clientHeight;

        let renderer = new THREE.WebGLRenderer();

        renderer.setSize(this.width, this.height);
        this.container.appendChild(renderer.domElement);

        return renderer;
    }

    camera() {
        return new THREE.PerspectiveCamera(
            this.view_angle,
            this.width / this.height,
            this.near,
            this.far
        );
    }


    project() {
        let renderer = this.renderer();
        let camera   = this.camera();
        let scene    = new THREE.Scene();


        let radius         = 50;
        let segment        = 16;
        let rings          = 16;
        let sphereMaterial = new THREE.MeshLambertMaterial({color: 0xCC0000});

        let sphere = new THREE.Mesh(
            new THREE.SphereGeometry(
                radius,
                segment,
                rings),

            sphereMaterial);

        sphere.position.z = -500;

        scene.add(sphere);

        let planeGeo = new THREE.PlaneGeometry(100, 50, 10, 100);
        let plane = new THREE.Mesh(planeGeo, sphereMaterial);

        plane.position.z = -400;

        plane.rotation.x = Math.PI/6;
        plane.rotation.z = Math.PI/6;
        plane.rotation.y = Math.PI/6;

        scene.add(plane);

        let pointLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
        let rad        = 150;
        let alpha      = 0;
        let x          = 0;

        pointLight.position.x = 0;
        pointLight.position.y = rad;
        pointLight.position.z = 1300;

        scene.add(pointLight);

        function rotate() {
            renderer.render(scene, camera);

            x = Math.PI * (alpha % 100 / 50);

            // console.log(Math.sin(x), Math.cos(x));

            pointLight.position.x = rad * Math.sin(x);
            pointLight.position.y = rad * Math.cos(x);

            alpha++;

            let r = requestAnimationFrame(rotate);

            if (alpha > 500) {
                cancelAnimationFrame(r);
            }
        }

        rotate();

    }


}
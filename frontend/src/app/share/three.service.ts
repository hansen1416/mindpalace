/**
 * Created by mok on 16-12-14.
 */
import {Injectable} from '@angular/core';

import * as THREE from "three";
import {Stats} from "@types/stats";

@Injectable()
export class ThreeService {

    private container: HTMLElement;


    private width: number;


    private height: number;


    renderer() {
        this.container = document.getElementById('canvas-frame');
        this.width     = this.container.clientWidth;
        this.height    = this.container.clientHeight;

        let renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        renderer.setSize(this.width, this.height);
        this.container.appendChild(renderer.domElement);
        renderer.setClearColor(0xFFFFFF, 1.0);
        return renderer;
    }

    scene() {
        return new THREE.Scene();
    }

    camera() {
        let camera = new THREE.PerspectiveCamera(50, this.width / this.height);

        camera.position.x = 0;
        camera.position.y = 1000;
        camera.position.z = 0;
        camera.up.x       = 0;
        camera.up.y       = 0;
        camera.up.z       = 1;
        camera.lookAt(this.vector3(0, 0, 0));

        return camera;
    }

    stats() {
        // let stats = new Stats();
        // stats.domElement.style.position = 'absolute';
        // stats.domElement.style.left = '0px';
        // stats.domElement.style.top = '0px';
        // document.getElementById('canvas-frame').appendChild(stats.domElement);
    }

    geometry() {
        return new THREE.Geometry();
    }

    material(parameters?) {
        return new THREE.MeshBasicMaterial(parameters);
    }

    color(color?) {
        return new THREE.Color(color);
    }

    cube() {
        return new THREE.Mesh(this.geometry(), this.material());
    }

    vector3(a, b, c) {
        return new THREE.Vector3(a, b, c);
    }

    light() {
        return new THREE.DirectionalLight(0xFFEE00, 1);
    }

    line(geometry?, material?, mode?) {
        return new THREE.Line(geometry, material, mode);
    }

    lineSegments() {
        return THREE.LineSegments;
    }

}
/**
 * Created by mok on 16-12-14.
 */
import {Injectable} from '@angular/core';

import * as THREE from "three";

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

    camera() {
        let camera = new THREE.PerspectiveCamera(50, this.width / this.height);

        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 600;
        camera.up.x       = 0;
        camera.up.y       = 1;
        camera.up.z       = 0;
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        return camera;
    }


    project() {
        let renderer = this.renderer();
        let camera   = this.camera();
        let scene    = new THREE.Scene();
        let light    = new THREE.AmbientLight(0xFFFFFF);

        light.position.set(100, 100, 200);
        scene.add(light);
        light = new THREE.PointLight(0x00FF00);
        light.position.set(0, 0, 300);
        scene.add(light);

        var geometry  = new THREE.CylinderGeometry(100, 150, 400);
        var material  = new THREE.MeshLambertMaterial({color: 0xFFFF00});
        var mesh      = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 0, 0);
        scene.add(mesh);

        let ani = function () {
            renderer.clear();
            camera.position.x += 1;
            renderer.render(scene, camera);
            requestAnimationFrame(ani);
        }
    }


}
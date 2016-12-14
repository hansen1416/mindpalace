/**
 * Created by mok on 16-12-14.
 */
import {Injectable} from '@angular/core';

import * as THREE from "three";

@Injectable()
export class ThreeService {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer();

    geometry = new THREE.CubeGeometry(1, 1, 1);

    material = new THREE.MeshBasicMaterial({color: 0x00ff00});

    cube = new THREE.Mesh(this.geometry, this.material);

}
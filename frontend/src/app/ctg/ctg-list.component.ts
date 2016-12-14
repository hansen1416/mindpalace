/**
 * Created by mok on 16-11-18.
 */
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import {CssService} from '../share/css.service';
import {CtgService} from './ctg.service';
import {ThreeService} from '../share/three.service';
import {Ctg} from "./ctg";
import {CtgPosition} from "./ctg-position";

@Component({
               selector   : 'ctg-list',
               templateUrl: './html/ctg-list.component.html',
               styles     : [require('./scss/ctg-list.component.scss')]
           })
export class CtgListComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private cssService: CssService,
        private ctgService: CtgService,
        private threeService: ThreeService
    ) {

    }


    private ctgList: Ctg[];


    private ctgPositions: CtgPosition[];


    ngOnInit() {
        this.route.params.forEach((params: Params) => {

            this.ctgService.setSpaceId = params['space_id'];
            this.ctgService.setCtgId   = params['ctg_id'];
        });
    }


    ngDoCheck() {
        this.ctgList      = this.ctgService.getCtgList;
        this.ctgPositions = this.ctgService.getCtgPositions;
    }


    ngAfterViewInit() {
        if (this.ctgService.getSpaceId) {
            this.ctgService.getCtgListBySpaceId().subscribe(response => this.renderCtgList(response));
        }

        if (this.ctgService.getCtgId) {
            this.ctgService.getCtgListByCtgId().subscribe(response => this.renderCtgList(response));
        }
    }


    private renderCtgList(ctgList: Ctg[]) {
        this.ctgService.setCtgList = ctgList;

        let renderer = this.threeService.renderer();
        let geometry = this.threeService.geometry();
        let material = this.threeService.material({vertexColors: true});
        let color1   = this.threeService.color(0x444444);
        let color2   = this.threeService.color(0xFF0000);
        let point1   = this.threeService.vector3(-100, 0, 100);
        let point2   = this.threeService.vector3(100, 0, -100);

        geometry.vertices.push(point1);
        geometry.vertices.push(point2);
        geometry.colors.push(color1, color2);

        let line   = this.threeService.line(geometry, material, this.threeService.lineSegments());
        let scene  = this.threeService.scene();
        let camera = this.threeService.camera();

        scene.add(line);

        renderer.clear();
        renderer.render(scene, camera);

    }


}
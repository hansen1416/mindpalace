/**
 * Created by mok on 16-11-18.
 */
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {AbstractThreeComponent} from '../three/abstract-three.component';
import {CtgService} from './ctg.service';
import {ApiRoutesService} from '../share/api-routes.service';
import {ApiHttpService} from '../share/api-http.service';
import {Ctg} from "./ctg";

@Component({
               selector   : 'ctg-list',
               templateUrl: './html/ctg-list.component.html',
               styles     : [require('./scss/ctg-list.component.scss')]
           })
export class CtgListComponent extends AbstractThreeComponent implements OnInit {

    private timer = 0;

    private timerAnimation: number;

    private renderAnimation: number;

    protected intersect: THREE.Sprite;

    protected drag: THREE.Sprite;

    protected dragLines: THREE.Line[];

    protected originDragPosition: THREE.Vector3;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private ctgService: CtgService,
        private apiRoutes: ApiRoutesService,
        private apiHttp: ApiHttpService
    ) {
        super();
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {

            this.ctgService.setSpaceId = params['space_id'];
            this.ctgService.setCtgId   = params['ctg_id'];
        });
        
        console.log('init');
    }


    ngAfterViewInit() {
        this.getDataAndRender();

        console.log('view');
    }


    private getDataAndRender() {
        this.ctgService.getCtgListBySpaceIdCtgId().subscribe(response => this.renderCtgList(response));
    }


    private renderCtgList(ctgList: Ctg[]) {
        this.ctgService.setCtgList = ctgList;

        this.processData(this.ctgService.getCtgList);
        this.project();
    }

    /**
     * mouse down event,
     * update mouse position
     * count time, if more than one second, start drag event
     * @param event
     */
    protected onMouseDown = (event: MouseEvent): void => {
        event.preventDefault();

        this.updateMousePosition(event);

        this.countPressTime();
    };

    /**
     * mouse move event
     * update this.mouse x,y position
     * @param event
     */
    protected onMouseMove = (event: MouseEvent): void => {
        event.preventDefault();
        this.updateMousePosition(event);

        this.timer = 0;
        cancelAnimationFrame(this.timerAnimation);
    };

    /**
     * drag event,
     *
     * @param event
     */
    protected onMouseDrag = (event: MouseEvent): void => {
        event.preventDefault();

        this.updateMousePosition(event);

        let vector = new THREE.Vector3();

        vector.set(
            this.mouse.x,
            this.mouse.y,
            0.5);

        vector.unproject(this.camera);

        let dir = vector.sub(this.camera.position).normalize();

        let distance = -this.camera.position.z / dir.z;

        let pos = this.camera.position.clone().add(dir.multiplyScalar(distance));

        this.drag.position.set(pos.x, pos.y, pos.z);

        if (this.dragLines) {
            let i = 0;

            while (i < this.dragLines.length) {
                let geometry                = <THREE.Geometry>this.dragLines[i].geometry;
                geometry.vertices[0]        = new THREE.Vector3(pos.x, pos.y, pos.z);
                geometry.verticesNeedUpdate = true;
                i++;
            }
        }

    };

    /**
     * when mouse up
     * set timer to 0, cancel countPressTime animation
     * remove onMouseDrag event
     * add onMouseMove event back
     * @param event
     */
    protected onMouseUp = (event: MouseEvent): void => {
        event.preventDefault();

        this.timer = 0;
        cancelAnimationFrame(this.timerAnimation);

        /**
         * if there is drag sprite,
         * restore its position to origin if it's not going to change its parent
         * if drag the sprite to a target ctg, and the sprite can be added under the target ctg,
         * request api, and refresh the canvas.
         */
        if (this.drag) {
            this.controls.enabled = true;
            this.webGLRenderer.domElement.removeEventListener('mousemove', this.onMouseDrag, false);
            this.webGLRenderer.domElement.addEventListener('mousemove', this.onMouseMove, false);

            let target = this.getFirstIntersectedObject(1, true);

            if (target) {

                this.apiHttp.get(this.apiRoutes.ctgMove(
                    this.drag.userData.space_id,
                    this.drag.userData.ctg_id,
                    target.userData.ctg_id
                )).subscribe(response => {
                    if (undefined !== response.result) {
                        this.ctgService.getCtgListBySpaceIdCtgId().subscribe(response => {
                            this.ctgService.setCtgList = response;

                            this.processData(this.ctgService.getCtgList);
                            //rebuild the scene
                            this.buildSpheres();

                            cancelAnimationFrame(this.renderAnimation);

                            this.renderAnimate();
                        });
                    }
                });

            } else {
                this.drag.position.set(this.originDragPosition.x, this.originDragPosition.y, this.originDragPosition.z);

                let i = 0;
                while (i < this.dragLines.length) {
                    let geometry                = <THREE.Geometry>this.dragLines[i].geometry;
                    geometry.vertices[0]        = this.originDragPosition;
                    geometry.verticesNeedUpdate = true;
                    i++;
                }
            }

            this.drag               = undefined;
            this.dragLines          = undefined;
            this.originDragPosition = undefined;
        }
    };

    /**
     * click event of the sprites
     * @param event
     */
    protected onClick = (event: MouseEvent): void => {
        event.preventDefault();

        this.updateMousePosition(event);

        let currentObject = this.getFirstIntersectedObject();

        if (currentObject) {
            this.intersect = currentObject;
            console.log(this.intersect.userData);
            //todo sprite click event goes here
        } else {
            this.setSpriteToOrigin();
            this.intersect = null;
        }
    };


    protected onDoubleClick = (event: MouseEvent): void=> {
        event.preventDefault();

        this.updateMousePosition(event);

        let currentObject = this.getFirstIntersectedObject();

        if (currentObject) {
            this.intersect = currentObject;

            this.router.navigate([
                                     '/space',
                                     this.intersect.userData.space_id,
                                     'ctg',
                                     this.intersect.userData.ctg_id
                                 ],
                                 {relativeTo: this.route});
        } else {
            this.setSpriteToOrigin();
            this.intersect = null;
        }
    };

    /**
     * after mouse down, count the time until 1 second
     * disable trackball controls, cancel countPressTime animation
     * get drag object
     * remove onMouseMove event
     * add onMouseDrag event
     */
    private countPressTime() {
        this.timerAnimation = requestAnimationFrame(()=>this.countPressTime());

        this.timer++;

        /**
         * press mouse more than 1 second,
         * stop timer, disable trackball control
         * add drag event, remove mouse move event
         */
        if (this.timer >= 17) {

            this.drag = this.getFirstIntersectedObject();

            if (this.drag) {

                this.controls.enabled = false;
                cancelAnimationFrame(this.timerAnimation);
                //must assign it to empty object, otherwise the position updates when dragging
                this.originDragPosition = Object.assign({}, this.drag.position);
                //dragLines are lines connect the drag Sprite and its sub ctg
                this.dragLines          = this.getDesLinesByCtgId(this.drag.name);

                this.webGLRenderer.domElement.removeEventListener('mousemove', this.onMouseMove, false);
                this.webGLRenderer.domElement.addEventListener('mousemove', this.onMouseDrag, false);
            }
        }
    }


    private getDesLinesByCtgId(name: string) {
        let n     = this.lineGroup.children.length;
        let i     = 0;
        let reg   = new RegExp('^' + name + '-');
        let lines = [];

        while (i < n) {
            if (this.lineGroup.children[i].name.match(reg)) {
                lines.push(this.lineGroup.children[i]);
            }
            i++
        }

        return lines;
    }

    /**
     * update the mouse position
     * @param event
     */
    private updateMousePosition(event: MouseEvent): void {
        // normalize between -1 and +1
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
    }

    /**
     * get the mouse ray casted first element
     * @param index
     * @param allowRootCtg
     * @returns THREE.Sprite | null
     */
    private getFirstIntersectedObject(index?: number, allowRootCtg ?: boolean): THREE.Sprite | null {
        this.raycaster.setFromCamera(this.mouse, this.camera);

        let intersected = this.raycaster.intersectObjects(this.spriteGroup.children);

        if (intersected && intersected.length) {
            index = index || 0;
            return (intersected[index] && intersected[index].object.type == 'Sprite' && (allowRootCtg || 0 != intersected[index].object.userData.tier))
                ? <THREE.Sprite>intersected[index].object : null;
        }

        return null;
    }

    /**
     * restore the colour and shape of the intersected sprite to the original status
     * @param currentObject
     */
    private setSpriteToOrigin(currentObject?): void {
        if (this.intersect) {

            if (currentObject && this.intersect.uuid != currentObject.uuid) {
                this.intersect.material.color.set(0xffffff);
            }

            if (!currentObject) {
                this.intersect.material.color.set(0xffffff);
            }
        }
    }

    /**
     * render the canvas
     */
    protected renderAnimate(): void {

        this.renderAnimation = requestAnimationFrame(()=>this.renderAnimate());

        this.controls.update();
        this.raycast();
        this.renderWebGL();
    }

    /**
     * when mouse moving, get the first ray cast sprite
     * update this.intersect
     */
    private raycast(): void {

        let currentObject = this.getFirstIntersectedObject();

        if (currentObject) {

            this.webGLRenderer.domElement.style.cursor = 'pointer';

            this.setSpriteToOrigin(currentObject);

            currentObject.material.color.set(0xff0000);
            this.intersect = currentObject;
        } else {
            this.webGLRenderer.domElement.style.cursor = 'default';
        }
    }


    project(): void {

        this.initWebGL();

        this.trackBallControl();

        this.buildSpheres();

        this.renderAnimate();

        this.webGLRenderer.domElement.addEventListener('mousedown', this.onMouseDown, false);

        this.webGLRenderer.domElement.addEventListener('mouseup', this.onMouseUp, false);

        this.webGLRenderer.domElement.addEventListener('mousemove', this.onMouseMove, false);

        this.webGLRenderer.domElement.addEventListener('click', this.onClick, false);

        this.webGLRenderer.domElement.addEventListener('dblclick', this.onDoubleClick, false);
    }

}
/**
 * Created by hlz on 16-11-18.
 */
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';

import {AbstractThreeComponent} from '../three/abstract-three.component';
import {CtgService} from './ctg.service';
import {ApiRoutesService} from '../share/api-routes.service';
import {ApiHttpService} from '../share/api-http.service';
import {MessageService} from '../message/message.service';
// import {ThreeService} from '../three/three.service';
import {Ctg, MousePosition} from "./ctg";


@Component({
               selector   : 'ctg-list',
               templateUrl: './html/ctg-list.component.html',
               styles     : [require('./scss/ctg-list.component.scss')]
           })
export class CtgListComponent extends AbstractThreeComponent implements OnInit, OnDestroy {

    private timer                     = 0;
    //timer animation, count press time
    private timerAnimation: number;
    //render the scene, mouse control the ctg list
    private renderAnimation: number;
    //first of the mouse hovering element
    protected intersect: THREE.Sprite;
    //click selected sprite
    protected selected: THREE.Sprite;
    //previous selected sprite
    private previousSelected: THREE.Sprite;
    //when selected sprite changed to selectedColor, its value set to true, when click a new sprite, its value set to false
    private selectedPainted           = false;
    //the descendant sprite of the selected ctg
    protected selectedDescendants     = <Array<THREE.Sprite>>[];
    //the descendant sprite uuid of the selected ctg
    protected selectedDescendantsUuid = <Array<string>>[];
    //dragged sprite
    protected drag: THREE.Sprite;
    //the lines connected to the dragged sprite
    protected dragLines: THREE.Line[];
    //the origin position of the dragged sprite element
    protected originDragPosition: THREE.Vector3;
    //previous visited ctg
    protected previous;
    //show or hide control panel
    private showControl               = false;
    //space_id in url
    private urlSpaceId: number;
    //ctg_id in url
    private urlCtgId: number;
    //subscription to the url parameters
    private subscriptionParam: Subscription;
    //subscription to the previous visited ctg
    private subscriptionPrevious: Subscription;
    //if the scene has been projected already
    private projected                 = false;
    //the mouse position then mouse clicked a ctg
    protected controlPos: MousePosition;
    //original sprite background color
    protected originColor: number     = 0xffffff;
    //hovering sprite background color
    protected hoverColor: number      = 0x5db6ff;
    //selected sprite background color
    protected selectedColor: number   = 0xff0000;
    //moving target ctg color
    protected moveColor: number       = 0xFFD700;
    //color for the selected ctg descendants
    protected descendantColor: number = 0x00ff00;
    //moving targets ctg
    protected moveTarget: THREE.Sprite;

    constructor(
        protected location: Location,
        protected route: ActivatedRoute,
        protected router: Router,
        protected ctgService: CtgService,
        protected apiRoutesService: ApiRoutesService,
        protected apiHttpService: ApiHttpService,
        protected messageService: MessageService,
        // private threeService: ThreeService,
    ) {
        super();
    }

    ngOnInit() {
        this.subscriptionParam = this.route.params
                                     .subscribe((params: Params) => {
                                         this.ctgService.setSpaceId = this.urlSpaceId = params['space_id'];
                                         this.ctgService.setCtgId = this.urlCtgId = params['ctg_id'];

                                         if (this.projected) {
                                             this.rebuildScene();
                                         }
                                     });

        this.subscriptionPrevious = this.ctgService.previous$.subscribe(
            previous => {
                this.previous = previous.length ? previous[0] : null;
            }
        );

    }

    /**
     * todo
     * after canvas loaded, request the data, then project the scene
     * try to separate loading data part to the ngOnInit
     */
    ngAfterViewInit() {
        this.ctgService.getCtgListBySpaceIdCtgId().subscribe(
            (response: Ctg[]) => {

                this.ctgService.setCtgList = response;

                this.processData(this.ctgService.getCtgList);

                this.project();

                this.afterSceneFinished();
            }
        );
    }

    /**
     * after ctg list updated,
     * fetch data from server
     * rebuild the scene
     */
    private rebuildScene() {

        this.hideControls();

        this.ctgService.setSpaceId = this.urlSpaceId;
        this.ctgService.setCtgId   = this.urlCtgId;

        this.ctgService.getCtgListBySpaceIdCtgId().subscribe(response => {
            this.ctgService.setCtgList = response;

            this.processData(this.ctgService.getCtgList);
            //rebuild the scene
            this.buildSpheres();

            cancelAnimationFrame(this.renderAnimation);

            this.renderAnimate();

            this.afterSceneFinished();
        });
    }

    /**
     * action to be taken after scene finished
     */
    private afterSceneFinished() {
        // this.threeService.setSpriteGroup(this.spriteGroup);

        this.data = [];
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

        this.getDragCollision();
    };

    /**
     * move target ctg background color change
     */
    private getDragCollision(): void {
        this.raycaster.setFromCamera(this.mouse, this.camera);

        let intersected = this.raycaster.intersectObjects(this.spriteGroup.children);

        if (intersected && intersected.length > 1 && this.drag && this.drag.uuid != intersected[1].object.uuid) {
            let target = <THREE.Sprite>intersected[1].object;
            //set the previous move target color to origin
            if (this.moveTarget) {
                this.moveTarget.material.color.setHex(this.originColor);
                this.moveTarget.material.needsUpdate = true;
            }

            this.moveTarget = target;
            target.material.color.setHex(this.moveColor);
            target.material.needsUpdate = true;
        }
    }


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
            //clear the move color
            if (this.moveTarget) {
                this.moveTarget.material.color.setHex(this.originColor);
                this.moveTarget.material.needsUpdate = true;
            }

            let target = this.getFirstIntersectedObject(1, true);

            if (target) {

                this.apiHttpService.get(this.apiRoutesService.ctgMove(
                    this.drag.userData.space_id,
                    this.drag.userData.ctg_id,
                    target.userData.ctg_id
                )).subscribe(response => this.messageService.handleResponse(response, () => {
                    //refresh the scene
                    this.rebuildScene();
                    //hide control panel
                    this.hideControls();
                }));

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
            //if current clicking sprite is not the selected sprite
            //set it as the new selected sprite, previous selected as previousSelected
            //and set selectedPainted to false, so it color will be changed to selectedColor
            if (!this.selected || (this.selected && this.selected.uuid != currentObject.uuid)) {
                if (this.selected) {
                    this.previousSelected = this.selected;
                }
                //new selected sprite
                this.selected        = currentObject;
                this.selectedPainted = false;
                //clear the descendants color
                if (this.selectedDescendants.length) {
                    let j = 0;

                    while (j < this.selectedDescendants.length) {
                        this.selectedDescendants[j].material.color.setHex(this.originColor);
                        j++;
                    }
                }
                //clear the descendants data
                this.selectedDescendants     = [];
                this.selectedDescendantsUuid = [];
            }

            //set selected ctg
            this.ctgService.setCtg = currentObject.userData;
            //set control panel position
            this.controlPos        = {x: event.clientX, y: event.clientY};
            //update control position in ctg service
            this.ctgService.setControlPosition(this.controlPos);
            //show control panel
            this.showControls();

            //paint the descendants sprites of the selected ctg with the descendant color
            let i = 0;

            while (i < this.spriteGroup.children.length) {

                if (this.spriteGroup.children[i].userData.path.match('-' + currentObject.userData.ctg_id + '-')) {
                    let sprite = <THREE.Sprite>this.spriteGroup.children[i];

                    sprite.material.color.setHex(this.descendantColor);

                    this.selectedDescendants.push(sprite);
                    this.selectedDescendantsUuid.push(sprite.uuid);
                }
                i++;
            }

        } else {
            this.setSpriteToOrigin();
            this.intersect = null;
        }


    };

    /**
     * double click, view the descendants of selected ctg
     * @param event
     */
    protected onDoubleClick = (event: MouseEvent): void => {
        event.preventDefault();

        this.updateMousePosition(event);

        let currentObject = this.getFirstIntersectedObject();

        if (currentObject) {
            this.intersect = currentObject;

            let parentCtg = this.spriteGroup.getObjectByName(this.intersect.userData.pid + '');

            this.ctgService.addPrevious = parentCtg.userData.ctg.title;

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

            this.hideControls();
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
        this.timerAnimation = requestAnimationFrame(() => this.countPressTime());

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

    /**
     * get the lines of a ctg that connect it with all its descendants
     * @param name
     * @returns {Array}
     */
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
     * resize event
     */
    protected onWindowResize = (): void => {

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.webGLRenderer.setSize(window.innerWidth, window.innerHeight);
    };

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
        //if there is a intersect sprite
        //and ( there is no selected sprite or the selected sprite is not the intersect sprite )
        if (this.intersect && (!this.selected || (this.selected && this.selected.uuid != this.intersect.uuid))) {

            if (currentObject && this.intersect.uuid != currentObject.uuid) {
                //if the currentObject is one of the selected descendants 
                // then set its color to descendantColor, otherwise to originColor
                if (this.selectedDescendantsUuid.includes(currentObject.uuid)) {
                    this.intersect.material.color.setHex(this.descendantColor);
                } else {
                    this.intersect.material.color.setHex(this.originColor);
                }
            }

            if (!currentObject) {
                //if the intersect is one of the selected descendants 
                // then set its color to descendantColor, otherwise to originColor
                if (this.selectedDescendantsUuid.includes(this.intersect.uuid)) {
                    this.intersect.material.color.setHex(this.descendantColor);
                } else {
                    this.intersect.material.color.setHex(this.originColor);
                }
            }
        }

    }

    /**
     * render the canvas
     */
    protected renderAnimate(): void {

        this.renderAnimation = requestAnimationFrame(() => this.renderAnimate());

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
        //hovering sprite
        if (currentObject) {

            this.webGLRenderer.domElement.style.cursor = 'pointer';

            this.setSpriteToOrigin(currentObject);
            //if the current hovering sprite is not the selected sprite the set its color to hover color
            if (!this.selected || (this.selected && currentObject.uuid != this.selected.uuid)) {
                currentObject.material.color.setHex(this.hoverColor);
            }
            this.intersect = currentObject;
        } else {
            this.webGLRenderer.domElement.style.cursor = 'default';
        }
        //when there is a selected sprite and it has not yet been painted with selected color
        if (this.selected && !this.selectedPainted) {
            this.selected.material.color.setHex(this.selectedColor);
            this.selectedPainted = true;
        }
        //if there is a previous selected sprite, then set its color to origin and delete the previous selected
        if (this.previousSelected) {
            this.previousSelected.material.color.setHex(this.originColor);
            delete this.previousSelected;
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

        window.addEventListener('resize', this.onWindowResize, false);

        this.projected = true;
    }

    /**
     * hide control panel and content editor
     */
    private hideControls() {
        //hide the control buttons
        this.showControl = false;
        this.ctgService.hideAddCtgInput();
    }

    private showControls() {
        this.showControl = true;
        this.ctgService.hideAddCtgInput();
    }

    /**
     * go back to previous url,
     * shift previous array of ctg service
     */
    protected goPreviousCtg() {
        this.ctgService.shiftPrevious();
        this.location.back();
    }

    /**
     * set control panel position
     * @returns {{display: string, width: number, height: number, position: string, top: string, left: string}}
     */
    ctgControlPosition() {
        return {
            display : 'block',
            width   : 0,
            height  : 0,
            position: 'absolute',
            top     : this.controlPos.y + 'px',
            left    : this.controlPos.x + 'px'
        };
    }


    ngOnDestroy() {
        this.subscriptionParam.unsubscribe();
        this.subscriptionPrevious.unsubscribe();
    }


}
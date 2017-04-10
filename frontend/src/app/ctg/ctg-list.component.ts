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
    protected hovering: THREE.Sprite;
    //click selected sprite
    protected selected: THREE.Sprite;
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
    //moving targets ctg
    protected moveTarget: THREE.Sprite;
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

    constructor(
        protected location: Location,
        protected route: ActivatedRoute,
        protected router: Router,
        protected ctgService: CtgService,
        protected apiRoutesService: ApiRoutesService,
        protected apiHttpService: ApiHttpService,
        protected messageService: MessageService,
    ) {
        super();
    }

    ngOnInit() {
        this.subscriptionParam = this.route.params
                                     .subscribe((params: Params) => {
                                         this.ctgService.setSpaceId = this.urlSpaceId = params['space_id'];
                                         this.ctgService.setCtgId = this.urlCtgId = params['ctg_id'];
                                         //when click a ctg, the scene already been projected, so only the scene, no need to reload the component
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
                this.processData(response);

                this.project();

                this.afterSceneFinished();

                this.firstTime = false;
            }
        );
    }


    /**
     * after ctg list updated,
     * fetch data from server
     * rebuild the scene
     */
    private rebuildScene() {

        this.ctgService.setSpaceId = this.urlSpaceId;
        this.ctgService.setCtgId   = this.urlCtgId;

        this.ctgService.getCtgListBySpaceIdCtgId().subscribe(
            (response: Ctg[]) => {
                cancelAnimationFrame(this.renderAnimation);

                this.processData(response);
                //rebuild the scene
                this.buildSpheres();

                this.renderAnimate();

                this.afterSceneFinished();
            }
        );
    }

    /**
     * action to be taken after scene finished
     */
    private afterSceneFinished() {
        this.hovering                = undefined;
        this.selected                = undefined;
        this.selectedDescendants     = [];
        this.selectedDescendantsUuid = [];
        this.drag                    = undefined;
        this.dragLines               = [];
        this.originDragPosition      = undefined;
        this.moveTarget              = undefined;
        this.data                    = [];
        this.hideControls();
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

        intersected = null;
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

        if (!this.drag) {
            return;
        }

        /**
         * if there is drag sprite,
         * restore its position to origin if it's not going to change its parent
         * if drag the sprite to a target ctg, and the sprite can be added under the target ctg,
         * request api, and refresh the canvas.
         */
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

    };

    /**
     * click event of the sprites
     * @param event
     */
    private onClick = (event: MouseEvent): void => {
        event.preventDefault();

        this.updateMousePosition(event);

        let currentObject = this.getFirstIntersectedObject();

        if (!currentObject) {
            return;
        }
        //when click a sprite, there will be no hovering sprite
        this.hovering = null;
        //if current target sprite is the selected sprite
        if (this.selected && this.selected.uuid == currentObject.uuid) {
            return;
        }

        let previousSelected: THREE.Sprite;

        //if current clicking sprite is not the selected sprite
        //set it as the new selected sprite, previous selected as previousSelected
        if (this.selected) {
            previousSelected = this.selected;
        }
        //new selected sprite, set its color to selectedColor
        this.selected = currentObject;

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

        this.selected.material.color.setHex(this.selectedColor);
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
        //find the descendants sprite, and set their color to descendantColor
        while (i < this.spriteGroup.children.length) {

            if (this.spriteGroup.children[i].userData.path.match('-' + currentObject.userData.ctg_id + '-')) {
                let sprite = <THREE.Sprite>this.spriteGroup.children[i];

                sprite.material.color.setHex(this.descendantColor);

                this.selectedDescendants.push(sprite);
                this.selectedDescendantsUuid.push(sprite.uuid);
            }
            i++;
        }
        //if there is a previous selected sprite,
        // then set its color to origin when it's not in the current descendants tree,
        // set to descendantColor if it is
        // and delete the previous selected
        if (previousSelected) {
            if (this.selectedDescendantsUuid.includes(previousSelected.uuid)) {
                previousSelected.material.color.setHex(this.descendantColor);
            } else {
                previousSelected.material.color.setHex(this.originColor);
            }

            previousSelected = null;
        }

        currentObject = null;
    };

    /**
     * double click, view the descendants of selected ctg
     * @param event
     */
    protected onDoubleClick = (event: MouseEvent): void => {
        event.preventDefault();

        this.updateMousePosition(event);

        let currentObject = this.getFirstIntersectedObject();
        //when double click blank space, clear the color, and hide the control
        if (!currentObject) {

            if (this.hovering) {
                this.hovering.material.color.setHex(this.originColor);
            }

            if (this.selected) {
                this.selected.material.color.setHex(this.originColor);
            }

            if (this.selectedDescendants) {
                let i = 0;
                while (i < this.selectedDescendants.length) {
                    this.selectedDescendants[i].material.color.setHex(this.originColor);
                    i++;
                }
            }

            this.afterSceneFinished();

            return;
        }

        //when double click a sprite, route to the corresponding ctg list
        let parentCtg = this.spriteGroup.getObjectByName(currentObject.userData.pid + '');

        this.ctgService.addPrevious = parentCtg.userData.ctg.title;

        this.router.navigate([
                                 '/space',
                                 currentObject.userData.space_id,
                                 'ctg',
                                 currentObject.userData.ctg_id
                             ],
                             {relativeTo: this.route});

        currentObject = null;
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
    private setSpriteToOrigin(currentObject: THREE.Sprite): void {
        //if no previous hovering, do nothing
        if (!this.hovering) {
            return;
        }
        //if the current intersected sprite is the selected sprite, do nothing
        //this is not necessary for now, because there is a same if condition before the function,
        //this will be necessary if use this function other place
        if (this.selected && currentObject.uuid == this.selected.uuid) {
            return;
        }
        //set the previous hovering to its corresponding origin color
        if (this.selectedDescendantsUuid.includes(this.hovering.uuid)) {
            this.hovering.material.color.setHex(this.descendantColor);
        } else {
            this.hovering.material.color.setHex(this.originColor);
        }

    }

    /**
     * when mouse moving, get the first ray cast sprite
     * update this.intersect
     */
    private raycast(): void {

        let currentObject = this.getFirstIntersectedObject();

        if (!currentObject) {
            this.webGLRenderer.domElement.style.cursor = 'default';
            return;
        }
        //hovering sprite
        this.webGLRenderer.domElement.style.cursor = 'pointer';
        //if the current intersected sprite is the selected sprite, then do nothing
        if (this.selected && currentObject.uuid == this.selected.uuid) {
            return;
        }
        //same sprite hover event once only
        if (this.hovering && this.hovering.uuid == currentObject.uuid) {
            return;
        }
        //set the previous hovering sprite color to its origin
        //could be originColor or descendantColor
        this.setSpriteToOrigin(currentObject);
        //set its color to hover color
        currentObject.material.color.setHex(this.hoverColor);
        //set the hovering sprite only here
        //when click the sprite, set the hovering to null
        //when double click blank space, set the hovering sprite to null
        this.hovering = currentObject;
    }

    /**
     * render the canvas
     */
    private renderAnimate(): void {

        this.renderAnimation = requestAnimationFrame(() => this.renderAnimate());
        //this will let the scene rotate
        this.controls.update();
        //track the mouse position and update the object status when mouse hover or click
        this.raycast();
        //render the scene
        this.renderWebGL();
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
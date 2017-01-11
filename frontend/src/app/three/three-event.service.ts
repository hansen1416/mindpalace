/**
 * Created by mok on 17-1-11.
 */
import {Injectable} from '@angular/core';

import {ThreeService} from './three.service';

@Injectable()
export class ThreeEventService extends ThreeService {

    constructor() {
        super();
    }

    /**
     * mouse move event
     * @param event
     */
    protected onMouseMove(event: Event): void {
        event.preventDefault();

        this.updateMousePosition(event);
    }

    /**
     * click event of the sprites
     * @param event
     */
    protected onClick(event: Event): void {
        event.preventDefault();

        this.updateMousePosition(event);

        let currentObject = this.getFirstIntersectedObject();

        if (currentObject) {
            this.intersect = currentObject;

            //todo sprite click event goes here
        } else {
            this.setSpriteToOrigin();
            this.intersect = null;
        }
    }

    /**
     * update the mouse position
     * @param event
     */
    private updateMousePosition(event): void {
        // normalize between -1 and +1
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
    }

    /**
     * get the mouse ray casted first element
     * @returns THREE.Sprite | null
     */
    private getFirstIntersectedObject(): THREE.Sprite | null {
        this.raycaster.setFromCamera(this.mouse, this.camera);

        let intersected = this.raycaster.intersectObjects(this.group.children);

        if (intersected.length) {
            switch (intersected[0].object.type) {
                case 'Sprite':
                    return <THREE.Sprite>intersected[0].object;
                case 'Line':
                    return null;
            }
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

        requestAnimationFrame(()=>this.renderAnimate());

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

        this.webGLRenderer.domElement.addEventListener('mousemove', ()=>this.onMouseMove(event), false);

        this.webGLRenderer.domElement.addEventListener('click', ()=>this.onClick(event), false);
    }


}
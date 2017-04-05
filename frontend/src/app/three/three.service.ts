/**
 * Created by hlz on 17-4-4.
 */
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

declare let THREE: any;

@Injectable()
export class ThreeService {
    private sripteGroupSource = new Subject<THREE.Group & THREE.Object3D>();

    public sripteGroup$ = this.sripteGroupSource.asObservable();


    setSpriteGroup(group: THREE.Group & THREE.Object3D) {
        this.sripteGroupSource.next(group);
    }
}

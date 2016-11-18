/**
 * Created by mok on 16-11-18.
 */
import {Injectable} from '@angular/core';

@Injectable()
export class CtgService {

    ctgList: Object[];

    constructor() {}

    getCtgListBySpaceId(space_id:number) {
        console.log(space_id);
    }


}
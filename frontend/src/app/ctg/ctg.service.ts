/**
 * Created by mok on 16-11-18.
 */
import {Injectable} from '@angular/core';

import {Ctg} from "./ctg";

@Injectable()
export class CtgService {

    private ctgList: Ctg[];


    constructor() {}


    setCtgList(ctgList:Ctg[]):void{
        this.ctgList = ctgList;
    }


    getCtgList():Ctg[]{
        return this.ctgList;
    }


}
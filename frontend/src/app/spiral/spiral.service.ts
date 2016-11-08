/**
 * Created by mok on 16-11-8.
 */
import {Injectable} from '@angular/core';

@Injectable()
export class SpiralService {

    nodeList:NodeListOf<Element>;

    setSphere(selector:string):void{
        this.nodeList = document.body.querySelectorAll(selector);
        
        console.log(this.nodeList);
    }
    
}
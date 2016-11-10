/**
 * Created by mok on 16-11-8.
 */
import {Injectable} from '@angular/core';

@Injectable()
export class SpiralService {

    nodeList:NodeListOf<Element>;

    /**
     * build the sphere
     * @param selector
     * @returns {boolean}
     */
    setSphere(selector:string):boolean{
        this.nodeList = document.body.querySelectorAll(selector);
        
        if (this.nodeList.length) {
            
            console.log(this.nodeList.length);
            
            return true;
        }else{
            return false;
        }
        
    }
    
}
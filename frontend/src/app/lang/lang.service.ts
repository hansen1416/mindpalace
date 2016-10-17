import {Injectable} from '@angular/core';
// import{ZH}from './langs/zh';
// import{EN}from './langs/en';

@Injectable()
export class LangService {

    // protected local = ZH;

    setLocal(languageName:string):void{
        // this.local = languageName.toUpperCase();
    }

    getLang(key:string):any {
        // return this.local;
    }
}
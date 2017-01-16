/**
 * Created by mok on 17-1-16.
 */
import {Injectable} from '@angular/core';

@Injectable()
export class StorageService {

    public setItem(key: string, value: any):void {
        localStorage.setItem(key, JSON.stringify(value));
    }


    public getItem<T>(key: string):T {
        return JSON.parse(localStorage.getItem(key));
    }

}
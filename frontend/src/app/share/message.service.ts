/**
 * Created by hlz on 17-2-15.
 */
import {Injectable} from '@angular/core';


@Injectable()
export class MessageService {

    showMessage = false;

    message: string;

    change() {
        this.showMessage = true;
    }

}
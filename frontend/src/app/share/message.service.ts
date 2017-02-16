/**
 * Created by hlz on 17-2-15.
 */
import {Injectable} from '@angular/core';
import {Subject}    from 'rxjs/Subject';


@Injectable()
export class MessageService {

    public showMessage = false;

    private messageSource = new Subject<string>();

    public message$ = this.messageSource.asObservable();

    show(value: string) {
        this.showMessage = true;
        this.messageSource.next(value);
    }

    hide(){
        this.showMessage = false;
        this.messageSource.next('');
    }
}
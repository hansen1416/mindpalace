/**
 * Created by hlz on 17-4-14.
 */
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class CKEditorService {
    private toggleEditorSource = new Subject<boolean>();

    public toggleEditor$ = this.toggleEditorSource.asObservable();

    editorOff() {
        this.toggleEditorSource.next(false);
    }

    editorOn() {
        this.toggleEditorSource.next(true);
    }
}
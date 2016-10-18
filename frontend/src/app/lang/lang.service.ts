import {Injectable, ReflectiveInjector} from '@angular/core';
import {ZH} from './i18n/zh';
import {EN} from './i18n/en';
import {LANG} from './lang.opaquetoken';
import {UserService} from '../user/user.service';
import {LangInterface} from './lang.interface';

@Injectable()
export class LangService {

    protected local: LangInterface;

    constructor(
        private userService: UserService
    ) {

        let userLocal = 'zh';
        let language;

        switch (userLocal) {
            case 'en':
                language = EN;
                break;
            default:
                language = ZH;
        }

        let injector = ReflectiveInjector.resolveAndCreate([
                                                               {provide: LANG, useValue: language}
                                                           ]);

        this.local = injector.get(LANG);
    }


    // protected local = ZH;

    // setLocal(languageName: string): void {
    //     // this.local = languageName.toUpperCase();
    // }

    getLang() {
        return this.local;
    }
}
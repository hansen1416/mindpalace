import {Injectable, OnInit, ReflectiveInjector} from '@angular/core';
import {ZH} from './i18n/zh';
import {EN} from './i18n/en';
import {LANG} from './lang.opaquetoken';
// import {UserService} from "../user/user.service";


@Injectable()
export class LangService {

    protected local;

    constructor(
        // private userService: UserService
    ) {

        // let userLocal = userService.getLocal();
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

    setLocal(languageName: string): void {
        // this.local = languageName.toUpperCase();
    }

    getLang(key: string): any {
        console.log(this.local);
    }
}
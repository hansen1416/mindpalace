import {Injectable, ReflectiveInjector} from '@angular/core';
import {ZH} from './i18n/zh';
import {EN} from './i18n/en';
import {LANG} from './lang.opaquetoken';
import {UserService} from '../core/user.service';
import {LangInterface} from './lang.interface';

@Injectable()
export class LangService {


    protected userLocal;


    constructor(
        private userService: UserService
    ) {
        this.userLocal = this.userService.getUserLanguage();
    }


    getLang(): LangInterface {

        let languagePackage: LangInterface;
        
        switch (this.userLocal) {
            case 'en':
                languagePackage = EN;
                break;
            default:
                languagePackage = ZH;
        }
console.log(this.userLocal);
        return languagePackage;
    }
}
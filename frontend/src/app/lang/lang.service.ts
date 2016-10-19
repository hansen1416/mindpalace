import {Injectable} from '@angular/core';
import {ZH} from './i18n/zh';
import {EN} from './i18n/en';
import {UserService} from '../core/user.service';
import {LangInterface} from './lang.interface';

@Injectable()
export class LangService {


    constructor(
        private userService: UserService
    ) {}


    getLanguagePackage(): LangInterface {

        let languagePackage: LangInterface;

        switch (this.userService.getUserLanguage()) {
            case 'en':
                languagePackage = EN;
                break;
            default:
                languagePackage = ZH;
        }

        return languagePackage;
    }


    translate(text: string): string {

        let languagePackage = this.getLanguagePackage();

        let keys = text.split('.');

        try {
            return languagePackage[keys[0]][keys[1]];
        }catch (e){
            console.warn('can not find translation for ' + text);
        }
    }

}
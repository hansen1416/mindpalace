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


    private getLanguagePackage(): LangInterface {

        let languagePackage: LangInterface;

        switch (this.userService.getUserProperty('language')) {
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

        if (!text) {
            return text;
        }

        let keys = text.split('.');

        try {
            if (keys[1].match(/-/)) {
                let p = keys[1].split('-');

                return languagePackage[keys[0]][p[0]].replace(/%%/, p[1]);
            }
            return languagePackage[keys[0]][keys[1]];
        } catch (e) {
            return text;
            // console.warn('can not find translation for ' + text);
        }
    }

}
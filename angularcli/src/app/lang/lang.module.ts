/**
 * Created by hlz on 16-10-18.
 */
import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LangService} from './lang.service';
import {LangPipe} from "./lang.pipe";

@NgModule({
              imports     : [CommonModule],
              declarations: [LangPipe],
              providers   : [LangService],
              exports     : [LangPipe],
          })
export class LangModule {
    constructor(@Optional() @SkipSelf() parentModule: LangModule) {
        if (parentModule) {
            throw new Error(
                'LangModule is already loaded. Import it in the AppModule only');
        }
    }
}
/**
 * Created by hlz on 17-1-11.
 */
import {NgModule, Optional, SkipSelf}            from '@angular/core';
import {CommonModule}        from '@angular/common';

import {SharedModule} from '../share/share.module';

import {AbstractThreeComponent} from './abstract-three.component';

@NgModule({
              imports     : [
                  CommonModule,
                  SharedModule,
              ],
              declarations: [
                  AbstractThreeComponent,
              ],
              exports     : [],
              providers   : [],
          })
export class ThreeModule {
    constructor(@Optional() @SkipSelf() parentModule: ThreeModule) {
        if (parentModule) {
            throw new Error(
                'SpiralModule is already loaded. Import it in the AppModule only');
        }
    }
}
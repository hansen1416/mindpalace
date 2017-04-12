/**
 * Created by hlz on 16-10-18.
 */
import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SpiralService} from './spiral.service';

@NgModule({
              imports  : [
                  CommonModule,
              ],
              // declarations: [
              // ],
              // exports     : [
              // ],
              providers: [
                  SpiralService,
              ],
          })
export class SpiralModule {
    constructor(@Optional() @SkipSelf() parentModule: SpiralModule) {
        if (parentModule) {
            throw new Error(
                'SpiralModule is already loaded. Import it in the AppModule only');
        }
    }
}

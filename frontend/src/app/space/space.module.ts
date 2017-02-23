/**
 * Created by hlz on 16-11-8.
 */
import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../share/share.module';
import {SpiralModule} from '../spiral/spiral.module';

import {SpaceService} from './space.service';
import {ConcentricService} from './concentric.service';

@NgModule({
              imports     : [
                  CommonModule,
                  SharedModule,
                  SpiralModule,
              ],
              declarations: [],
              exports     : [],
              providers   : [
                  ConcentricService,
                  SpaceService,
              ],
          })
export class SpaceModule {

    constructor(@Optional() @SkipSelf() parentModule: SpaceModule) {
        if (parentModule) {
            throw new Error(
                'SpaceModule is already loaded. Import it in the AppModule only');
        }
    }

}

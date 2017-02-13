/**
 * Created by mok on 16-11-8.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../share/share.module';
import {SpiralModule} from '../spiral/spiral.module';

import {SpaceService} from './space.service';
import {ConcentricService} from './concentric.service';
import {WebSpaceService} from './web-space.service';

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
                  WebSpaceService,
              ],
          })
export class SpaceModule {

}

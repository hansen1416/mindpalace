/**
 * Created by mok on 16-11-8.
 */
/**
 * Created by mok on 16-10-18.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../share/share.module';
import {SpiralModule} from '../spiral/spiral.module';

import {ConcentricService} from './concentric.service';

@NgModule({
              imports     : [
                  CommonModule,
                  SharedModule,
                  SpiralModule,
              ],
              declarations: [

              ],
              exports     : [

              ],
              providers   : [
                  ConcentricService,
              ],
          })
export class SpaceModule {

}

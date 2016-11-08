/**
 * Created by mok on 16-10-18.
 */
import {NgModule} from '@angular/core';
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

}

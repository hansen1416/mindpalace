/**
 * Created by mok on 17-1-11.
 */
import {NgModule}            from '@angular/core';
import {CommonModule}        from '@angular/common';

import {SharedModule} from '../share/share.module';

import {ThreeService}  from './three.service';
import {ThreeEventService}  from './three-event.service';

@NgModule({
              imports     : [
                  CommonModule,
                  SharedModule,
              ],
              declarations: [],
              exports     : [],
              providers   : [
                  ThreeService,
                  ThreeEventService,
              ],
          })
export class ThreeModule {
}
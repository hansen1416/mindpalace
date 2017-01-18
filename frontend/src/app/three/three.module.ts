/**
 * Created by mok on 17-1-11.
 */
import {NgModule}            from '@angular/core';
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
}
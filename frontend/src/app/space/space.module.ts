/**
 * Created by mok on 16-11-8.
 */
/**
 * Created by mok on 16-10-18.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../share/share.module';

import {SpaceHomeComponent} from './space-home.component';

@NgModule({
              imports     : [
                  CommonModule,
                  SharedModule,
              ],
              declarations: [
                  SpaceHomeComponent,
              ],
              exports     : [
                  SpaceHomeComponent,
              ],
              // providers   : [
              //
              // ]
          })
export class SpaceModule {

}

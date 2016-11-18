/**
 * Created by mok on 16-11-18.
 */
import {NgModule}       from '@angular/core';
import {CommonModule}   from '@angular/common';

import {SharedModule}    from '../share/share.module';
import {CtgRoutingModule} from './ctg-routing.module';

import {CtgListComponent} from './ctg-list.component';

@NgModule({
              imports     : [
                  CommonModule,
                  SharedModule,
                  CtgRoutingModule,
              ],
              declarations: [
                  CtgListComponent,
              ],
              providers   : [

              ]
          })
export class CtgModule {
}

/**
 * Created by mok on 16-11-18.
 */
import {NgModule}       from '@angular/core';
import {CommonModule}   from '@angular/common';

import {SharedModule}    from '../share/share.module';
import {CtgRoutingModule} from './ctg-routing.module';
import {ThreeModule} from '../three/three.module';

import {CtgListComponent} from './ctg-list.component';
import {CtgService} from './ctg.service';
import {CtgStyleDirective} from './ctg-style.directive';

@NgModule({
              imports     : [
                  CommonModule,
                  SharedModule,
                  CtgRoutingModule,
                  ThreeModule,
              ],
              declarations: [
                  CtgListComponent,
                  CtgStyleDirective,
              ],
              providers   : [
                  CtgService,
              ],
          })
export class CtgModule {
}

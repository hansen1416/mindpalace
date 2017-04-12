/**
 * Created by hlz on 16-11-18.
 */
import {NgModule, Optional, SkipSelf}       from '@angular/core';
import {CommonModule}   from '@angular/common';

import {SharedModule}    from '../share/share.module';
import {CtgRoutingModule} from './ctg-routing.module';
import {ThreeModule} from '../three/three.module';

import {CtgListComponent} from './ctg-list.component';
import {CtgControlComponent} from './ctg-control.component';
import {SimplemdeComponent} from './simplemde.component';
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
                  SimplemdeComponent,
                  CtgStyleDirective,
                  CtgControlComponent,
              ],
              providers   : [
                  CtgService,
              ],
          })
export class CtgModule {
    constructor(@Optional() @SkipSelf() parentModule: CtgModule) {
        if (parentModule) {
            throw new Error(
                'CtgModule is already loaded. Import it in the AppModule only');
        }
    }
}

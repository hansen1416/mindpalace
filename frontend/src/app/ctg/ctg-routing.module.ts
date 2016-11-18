/**
 * Created by mok on 16-11-18.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';

import {CtgListComponent}    from './ctg-list.component';

@NgModule({
              imports: [
                  RouterModule.forChild([
                                            {path: 'space/:space_id', component: CtgListComponent},
                                        ])
              ],
              exports: [
                  RouterModule
              ]
          })
export class CtgRoutingModule {
}

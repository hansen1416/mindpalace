/**
 * Created by hlz on 17-2-19.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';

import {ProfileComponent} from './profile.component';

@NgModule({
              imports: [
                  RouterModule.forChild([
                                            {path: 'profile/:user_id', component: ProfileComponent},
                                        ])
              ],
              exports: [
                  RouterModule
              ]
          })
export class ProfileRoutingModule {
}

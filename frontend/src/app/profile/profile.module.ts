/**
 * Created by hlz on 17-2-19.
 */
import {NgModule}       from '@angular/core';
import {CommonModule}   from '@angular/common';

import {SharedModule}    from '../share/share.module';
import {ProfileRoutingModule} from './profile-routing.module';

import {ProfileComponent} from './profile.component';

@NgModule({
              imports:      [
                  CommonModule,
                  SharedModule,
                  ProfileRoutingModule,
              ],
              declarations: [
                  ProfileComponent
              ],
              providers:    [],
          })
export class ProfileModule {
}
/**
 * Created by hlz on 17-2-19.
 */
import {NgModule, Optional, SkipSelf}       from '@angular/core';
import {CommonModule}   from '@angular/common';

import {SharedModule}    from '../share/share.module';
import {ProfileRoutingModule} from './profile-routing.module';

import {ProfileComponent} from './profile.component';
import {FriendsSearchComponent} from '../friends/friends-search.component';
import {FriendsComponent} from '../friends/friends.component';

@NgModule({
              imports     : [
                  CommonModule,
                  SharedModule,
                  ProfileRoutingModule,
              ],
              declarations: [
                  ProfileComponent,
                  FriendsSearchComponent,
                  FriendsComponent,
              ],
              providers   : [],
          })
export class ProfileModule {
    constructor(@Optional() @SkipSelf() parentModule: ProfileModule) {
        if (parentModule) {
            throw new Error(
                'ProfileModule is already loaded. Import it in the AppModule only');
        }
    }
}
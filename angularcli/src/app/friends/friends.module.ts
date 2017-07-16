/**
 * Created by hlz on 17-3-1.
 */
import {NgModule, Optional, SkipSelf}       from '@angular/core';
import {CommonModule}   from '@angular/common';

import {SharedModule} from '../share/share.module';

import {FriendsService} from './friends.service';

@NgModule({
              imports     : [
                  CommonModule,
                  SharedModule
              ],
              declarations: [
              ],
              providers   : [
                  FriendsService
              ],
          })
export class FriendsModule {
    constructor(@Optional() @SkipSelf() parentModule: FriendsModule) {
        if (parentModule) {
            throw new Error(
                'FriendsModule is already loaded. Import it in the AppModule only');
        }
    }
}
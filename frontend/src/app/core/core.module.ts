/**
 * Created by mok on 16-10-18.
 */
import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';

import {CommonModule}      from '@angular/common';

import {SharedModule} from '../share/share.module'

import {UserLoginComponent}    from './user-login.component';
import {UserService}       from './user.service';
import {UserServiceConfig} from './user.service';

@NgModule({
              imports     : [
                  CommonModule,
                  SharedModule
              ],
              declarations: [
                  UserLoginComponent
              ],
              exports     : [
                  UserLoginComponent
              ],
              providers   : [
                  UserService
              ]
          })
export class CoreModule {

    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(
                'CoreModule is already loaded. Import it in the AppModule only');
        }
    }

    static forRoot(config: UserServiceConfig): ModuleWithProviders {
        return {
            ngModule : CoreModule,
            providers: [
                {provide: UserServiceConfig, useValue: config}
            ]
        };
    }
}

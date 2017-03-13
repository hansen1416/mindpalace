/**
 * Created by hlz on 16-10-18.
 */
import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CoreRoutingModule} from './core-routing.module';
import {SharedModule} from '../share/share.module';
import {WebSocketModule} from '../websocket/web-socket.module';

import {UserLoginComponent} from './user-login.component';
import {UserRegisterComponent} from './user-register.component';
import {SpaceHomeComponent} from '../space/space-home.component';
import {SpaceSearchComponent} from '../space/space-search.component';
import {UserService}       from './user.service';
import {UserServiceConfig} from './user.service';

@NgModule({
              imports:      [
                  CommonModule,
                  CoreRoutingModule,
                  SharedModule,
                  WebSocketModule,
              ],
              declarations: [
                  UserLoginComponent,
                  UserRegisterComponent,
                  SpaceHomeComponent,
                  SpaceSearchComponent,
              ],
              exports:      [],
              providers:    [
                  UserService,
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
            ngModule:  CoreModule,
            providers: [
                {provide: UserServiceConfig, useValue: config}
            ]
        };
    }

}

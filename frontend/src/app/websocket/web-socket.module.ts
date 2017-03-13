/**
 * Created by hlz on 17-3-13.
 */
import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';

import {WebSocketService} from './web-socket.service';
import {PushService} from './push.service';

@NgModule({
              imports     : [
                  CommonModule,
              ],
              declarations: [],
              exports     : [],
              providers   : [
                  WebSocketService,
                  PushService,
              ],
          })
export class WebSocketModule {

    constructor(@Optional() @SkipSelf() parentModule: WebSocketModule) {
        if (parentModule) {
            throw new Error(
                'WebSocketModule is already loaded. Import it in the AppModule only');
        }
    }

}
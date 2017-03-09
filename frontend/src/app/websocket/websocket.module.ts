/**
 * Created by hlz on 17-3-9.
 */
import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';

import {WebSocketService} from './websocket.service';

@NgModule({
              imports     : [
                  CommonModule,
              ],
              declarations: [],
              exports     : [],
              providers   : [
                  WebSocketService,
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



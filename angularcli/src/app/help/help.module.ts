import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HelpComponent} from './help.component';

@NgModule({
              imports     : [
                  CommonModule
              ],
              declarations: [
                  HelpComponent
              ]
          })
export class HelpModule {
    constructor(@Optional() @SkipSelf() parentModule: HelpModule) {
        if (parentModule) {
            throw new Error(
                'HelpModule is already loaded. Import it in the AppModule only');
        }
    }
}

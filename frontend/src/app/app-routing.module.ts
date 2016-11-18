/**
 * Created by mok on 16-11-17.
 */
import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * define a empty route so AppComponent can recognize route-outlet
 * @type {Array}
 */
const routes: Routes = [];
@NgModule({
              imports: [ RouterModule.forRoot(routes) ],
              exports: [ RouterModule ]
          })
export class AppRoutingModule {}

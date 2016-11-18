/**
 * Created by mok on 16-11-18.
 */
import {NgModule}     from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {UserLoginComponent}    from './user-login.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: UserLoginComponent
    }
];

@NgModule({
              imports: [
                  RouterModule.forChild(routes)
              ],
              exports: [
                  RouterModule
              ]
          })
export class CoreRoutingModule {
}

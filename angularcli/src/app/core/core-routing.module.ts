/**
 * Created by hlz on 16-11-18.
 */
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {UserLoginComponent} from './user-login.component';
import {UserRegisterComponent} from './user-register.component';
import {ProfileComponent} from '../profile/profile.component';
import {HelpComponent} from '../help/help.component';

const routes: Routes = [
    {
        path      : '',
        redirectTo: '/home',
        pathMatch : 'full'
    },
    {
        path     : 'home',
        component: UserLoginComponent
    },
    {
        path     : 'register',
        component: UserRegisterComponent
    },
    {
        path     : 'profile/:user_id',
        component: ProfileComponent
    },
    {
        path     : 'help',
        component: HelpComponent
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

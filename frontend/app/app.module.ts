import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent}  from './app.component';
import {HttpModule} from '@angular/http';

import {UserService} from './user/user.service';
import {User} from './user/user';

@NgModule({
              imports     : [
                  BrowserModule,
                  HttpModule
              ],
              declarations: [
                  AppComponent
              ],
              bootstrap   : [
                  AppComponent
              ],
              providers   : [
                  UserService,
                  User
              ]
              // exports     : [],
          })
export class AppModule {
}

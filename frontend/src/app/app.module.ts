import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';

import {AppComponent}  from './app.component';
// import {LangService} from "./lang/lang.service";
import {User} from './user/user';
import {UserService} from './user/user.service';

// import {UserLoginComponent} from './user/user-login.component';


@NgModule({
              imports     : [
                  BrowserModule,
                  HttpModule,
                  FormsModule
              ],
              declarations: [
                  AppComponent,
                  // UserLoginComponent
              ],
              bootstrap   : [
                  AppComponent
              ],
              providers   : [
                  // LangService,
                  User,
                  UserService,

              ]
              // exports     : [],
          })
export class AppModule {
}
